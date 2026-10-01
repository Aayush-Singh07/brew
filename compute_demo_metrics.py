"""
Parses all demo CSVs and outputs a JSON of aggregated metrics
matching the Firestore metrics document shape needed by the dashboard.
DEMO_NOW = 2026-09-14 18:30 IST
"""
import csv, json, os
from collections import defaultdict
from datetime import datetime, date

DEMO_CSV_DIR = r"demo-csv\demo-cafe-csvs"
DEMO_NOW = datetime(2026, 9, 14, 18, 30)

sales_rows = []
expense_rows = []

for fname in sorted(os.listdir(DEMO_CSV_DIR)):
    fpath = os.path.join(DEMO_CSV_DIR, fname)
    if "sales" in fname:
        with open(fpath, encoding="utf-8") as f:
            for row in csv.DictReader(f):
                sales_rows.append(row)
    elif "expenses" in fname:
        with open(fpath, encoding="utf-8") as f:
            for row in csv.DictReader(f):
                expense_rows.append(row)

print(f"Loaded {len(sales_rows)} sales rows, {len(expense_rows)} expense rows")

# --- Revenue by day (last 30 days up to DEMO_NOW) ---
daily_revenue = defaultdict(float)
daily_orders_set = defaultdict(set)  # (date, time) -> set

for row in sales_rows:
    d = row["date"]
    t = row["time"]
    rev = float(row["revenue"])
    dt = datetime.strptime(d, "%Y-%m-%d")
    # Only include up to demo now date
    if dt.date() <= DEMO_NOW.date():
        daily_revenue[d] += rev
        daily_orders_set[d].add(t)

# Revenue by day list (last 30 days)
all_dates = sorted(daily_revenue.keys())[-30:]
revenue_by_day = [{"date": d, "revenue": round(daily_revenue[d], 2)} for d in all_dates]

# Total aggregates
total_revenue = sum(daily_revenue[d] for d in daily_revenue)
total_orders_per_day = {d: len(daily_orders_set[d]) for d in daily_orders_set}
total_orders = sum(total_orders_per_day.values())
avg_order_value = total_revenue / total_orders if total_orders > 0 else 0

print(f"Total Revenue: {total_revenue:.2f}")
print(f"Total Orders: {total_orders}")
print(f"AOV: {avg_order_value:.2f}")

# --- Expenses ---
daily_expenses = defaultdict(float)
expense_by_category = defaultdict(float)

for row in expense_rows:
    d = row["date"]
    amt = float(row["amount"])
    cat = row["category"]
    dt = datetime.strptime(d, "%Y-%m-%d")
    if dt.date() <= DEMO_NOW.date():
        daily_expenses[d] += amt
        expense_by_category[cat] += amt

total_expenses = sum(daily_expenses.values())
net_profit = total_revenue - total_expenses

print(f"Total Expenses: {total_expenses:.2f}")
print(f"Net Profit: {net_profit:.2f}")

# --- Revenue + Expenses by day for chart ---
revenue_expense_by_day = []
for d in sorted(set(list(daily_revenue.keys()) + list(daily_expenses.keys())))[-30:]:
    revenue_expense_by_day.append({
        "date": d,
        "revenue": round(daily_revenue.get(d, 0), 2),
        "expenses": round(daily_expenses.get(d, 0), 2)
    })

# --- Top products by revenue ---
product_revenue = defaultdict(float)
product_units = defaultdict(int)
product_category = {}

for row in sales_rows:
    dt = datetime.strptime(row["date"], "%Y-%m-%d")
    if dt.date() <= DEMO_NOW.date():
        name = row["product"]
        product_revenue[name] += float(row["revenue"])
        product_units[name] += int(row["quantity"])
        product_category[name] = row["category"]

top_products = sorted(product_revenue.keys(), key=lambda x: product_revenue[x], reverse=True)[:5]
top_products_data = [
    {
        "name": p,
        "revenue": round(product_revenue[p], 2),
        "units": product_units[p],
        "category": product_category[p]
    }
    for p in top_products
]
print("\nTop Products:", [(p["name"], p["revenue"]) for p in top_products_data])

# --- Category split (revenue) ---
category_revenue = defaultdict(float)
for row in sales_rows:
    dt = datetime.strptime(row["date"], "%Y-%m-%d")
    if dt.date() <= DEMO_NOW.date():
        category_revenue[row["category"]] += float(row["revenue"])

category_split = [
    {"category": cat, "revenue": round(rev, 2)}
    for cat, rev in sorted(category_revenue.items(), key=lambda x: x[1], reverse=True)
]
print("\nCategory Split:", [(c["category"], c["revenue"]) for c in category_split])

# --- Peak hours (revenue by hour, 0-23) ---
hour_revenue = defaultdict(float)
hour_orders = defaultdict(set)

for row in sales_rows:
    dt = datetime.strptime(row["date"], "%Y-%m-%d")
    if dt.date() <= DEMO_NOW.date():
        hour = int(row["time"].split(":")[0])
        hour_revenue[hour] += float(row["revenue"])
        hour_orders[hour].add((row["date"], row["time"]))

peak_hours = [
    {"hour": h, "label": f"{h:02d}:00", "revenue": round(hour_revenue[h], 2), "orders": len(hour_orders[h])}
    for h in range(8, 22)
]

# --- Expenses by category ---
expenses_by_category = [
    {"category": cat, "amount": round(amt, 2)}
    for cat, amt in sorted(expense_by_category.items(), key=lambda x: x[1], reverse=True)
]
print("\nExpenses by Category:", [(e["category"], e["amount"]) for e in expenses_by_category])

# --- Revenue by weekday ---
weekday_revenue = defaultdict(float)
weekday_orders = defaultdict(set)
WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
for row in sales_rows:
    dt = datetime.strptime(row["date"], "%Y-%m-%d")
    if dt.date() <= DEMO_NOW.date():
        wd = dt.weekday()  # 0=Mon
        weekday_revenue[wd] += float(row["revenue"])
        weekday_orders[wd].add((row["date"], row["time"]))

revenue_by_weekday = [
    {"weekday": WEEKDAYS[wd], "revenue": round(weekday_revenue[wd], 2), "orders": len(weekday_orders[wd])}
    for wd in range(7)
]

# --- KPI deltas (compare last 7d vs previous 7d) ---
from datetime import timedelta
demo_today = DEMO_NOW.date()
last7_dates = [(demo_today - timedelta(days=i)).isoformat() for i in range(7)]
prev7_dates = [(demo_today - timedelta(days=7+i)).isoformat() for i in range(7)]

rev_last7 = sum(daily_revenue.get(d, 0) for d in last7_dates)
rev_prev7 = sum(daily_revenue.get(d, 0) for d in prev7_dates)
ord_last7 = sum(total_orders_per_day.get(d, 0) for d in last7_dates)
ord_prev7 = sum(total_orders_per_day.get(d, 0) for d in prev7_dates)
exp_last7 = sum(daily_expenses.get(d, 0) for d in last7_dates)
exp_prev7 = sum(daily_expenses.get(d, 0) for d in prev7_dates)
prof_last7 = rev_last7 - exp_last7
prof_prev7 = rev_prev7 - exp_prev7
aov_last7 = (rev_last7 / ord_last7) if ord_last7 else 0
aov_prev7 = (rev_prev7 / ord_prev7) if ord_prev7 else 0

def pct(a, b):
    if b == 0: return 0
    return round((a - b) / b * 100, 1)

kpi_deltas = {
    "revenue": pct(rev_last7, rev_prev7),
    "orders": pct(ord_last7, ord_prev7),
    "aov": pct(aov_last7, aov_prev7),
    "profit": pct(prof_last7, prof_prev7)
}

# Assemble final metrics document
metrics = {
    "totalRevenue": round(total_revenue, 2),
    "totalOrders": total_orders,
    "averageOrderValue": round(avg_order_value, 2),
    "totalExpenses": round(total_expenses, 2),
    "netProfit": round(net_profit, 2),
    "revenueByDay": revenue_by_day,
    "revenueExpenseByDay": revenue_expense_by_day,
    "topProducts": top_products_data,
    "categorySplit": category_split,
    "peakHours": peak_hours,
    "expensesByCategory": expenses_by_category,
    "revenueByWeekday": revenue_by_weekday,
    "kpiDeltas": kpi_deltas,
    "demoNow": "2026-09-14T18:30:00+05:30",
    "dataThrough": "2026-09-14"
}

with open("demo_metrics.json", "w", encoding="utf-8") as f:
    json.dump(metrics, f, indent=2)

print("\nDone! demo_metrics.json written!")
print(f"Revenue: ₹{metrics['totalRevenue']:,.2f}")
print(f"Orders: {metrics['totalOrders']}")
print(f"AOV: ₹{metrics['averageOrderValue']:.2f}")
print(f"Net Profit: ₹{metrics['netProfit']:,.2f}")
print(f"KPI deltas (7d): {kpi_deltas}")
