import json

log_path = r"C:\Users\meera\.gemini\antigravity-ide\brain\ee22cecd-7b20-4f68-8e52-c16ae2126ad9\.system_generated\logs\transcript_full.jsonl"

dashboard_code = None

with open(log_path, 'r', encoding='utf-8') as f:
    for line in f:
        try:
            data = json.loads(line)
            
            # Check for tool_calls
            if 'tool_calls' in data:
                for call in data['tool_calls']:
                    if call['tool_name'] == 'default_api:write_to_file':
                        args = call['tool_arguments']
                        if 'MainAnalyticsDashboard.tsx' in args.get('TargetFile', ''):
                            dashboard_code = args.get('CodeContent', '')
                            # Get the first one that has the full code!
                            if len(dashboard_code) > 10000:
                                break
                if dashboard_code and len(dashboard_code) > 10000:
                    break
        except Exception:
            pass

if dashboard_code:
    with open('src/pages/MainAnalyticsDashboard.tsx', 'w', encoding='utf-8') as f:
        f.write(dashboard_code)
    print("Successfully restored MainAnalyticsDashboard.tsx from initial write_to_file call.")
else:
    print("Could not find full code in transcript.")
