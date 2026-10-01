# Demo Cafe — seeded data (1 Jun to 14 Sep 2026, today = 14 Sep 18:30 IST)

Files map 1:1 to upload slots: Jun, Jul, Aug (monthly) and Sep 1-7, Sep 8-14 (weekly),
each with a Sales CSV and an Expenses CSV.

Sales headers:    date,time,product,category,quantity,unit_price,revenue
Expenses headers: date,category,description,amount
There is no order_id column. Every order has a unique HH:MM:SS timestamp within its
day, so ORDERS = count of distinct (date, time). Do not count rows as orders.

## Planted patterns (the AI should be able to discover these)
- Weekend peak: Sat/Sun revenue is roughly 2x Mon/Tue/Wed.
- Dead window: Tue and Wed, 2-5 PM, almost no orders.
- Morning rush 9-10:30 AM on weekdays; Friday and weekend evenings 6-9 PM are strong.
- Masala Chai trending up month over month (monsoon).
- Cold Brew, Iced Latte and Butter Croissant trending down.
- Cappuccino and Cafe Latte are the steady best sellers.
- Ingredient cost share creeping up (about 33% of revenue in Jun to about 38% in Sep).
- Wages step up from 1 Aug (extra hire); Instagram ad spend rises through Sep.
- Rent lands on the 1st, so the Sep 1-7 week looks weak on profit; that is expected.
- 14 Sep sales stop at 18:30, matching the demo clock.
