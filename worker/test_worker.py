"""
test_worker.py
==============
Run this BEFORE starting the real worker to verify all operations work correctly.
No Redis or MongoDB needed — pure unit test.

Usage:
    python test_worker.py
"""

import sys
import os


sys.path.insert(0, os.path.dirname(__file__))


os.environ.setdefault("MONGO_URI",  "mongodb://127.0.0.1:27017/taskflow")
os.environ.setdefault("REDIS_HOST", "127.0.0.1")
os.environ.setdefault("REDIS_PORT", "6379")

from worker import process_operation, make_log, now_utc, extract_db_name

# ─── ANSI colours for terminal output ────────────────────────────────────────
GREEN  = "\033[92m"
RED    = "\033[91m"
YELLOW = "\033[93m"
RESET  = "\033[0m"
BOLD   = "\033[1m"

passed = 0
failed = 0


def check(description: str, got, expected):
    global passed, failed
    if got == expected:
        print(f"  {GREEN}✓{RESET}  {description}")
        passed += 1
    else:
        print(f"  {RED}✗{RESET}  {description}")
        print(f"      expected: {expected!r}")
        print(f"      got:      {got!r}")
        failed += 1




print(f"\n{BOLD}Taskflow Worker — Unit Tests{RESET}")
print("─" * 44)

# process_operation: uppercase
print(f"\n{YELLOW}Operations:{RESET}")
result, err = process_operation("uppercase", "Hello World")
check("uppercase: basic",          result, "HELLO WORLD")
check("uppercase: no error",       err,    None)

result, err = process_operation("uppercase", "")
check("uppercase: empty string",   result, "")

# lowercase
result, err = process_operation("lowercase", "Hello World")
check("lowercase: basic",          result, "hello world")

result, err = process_operation("lowercase", "ABC123")
check("lowercase: with numbers",   result, "abc123")

# reverse
result, err = process_operation("reverse", "Hello")
check("reverse: basic",            result, "olleH")

result, err = process_operation("reverse", "racecar")
check("reverse: palindrome",       result, "racecar")

result, err = process_operation("reverse", "")
check("reverse: empty",            result, "")

# word_count
result, err = process_operation("word_count", "Hello World")
check("word_count: two words",     result, "2")

result, err = process_operation("word_count", "one")
check("word_count: one word",      result, "1")

result, err = process_operation("word_count", "  spaces   around  ")
check("word_count: extra spaces",  result, "2")

result, err = process_operation("word_count", "")
check("word_count: empty string",  result, "0")

# unknown op
result, err = process_operation("explode", "text")
check("unknown op: result=None",   result, None)
check("unknown op: has error msg", err is not None, True)

#  Log structure 
print(f"\n{YELLOW}Log helpers:{RESET}")
entry = make_log("test message", "info")
check("make_log: has timestamp",   "timestamp" in entry, True)
check("make_log: has message",     entry["message"], "test message")
check("make_log: has level",       entry["level"], "info")
check("make_log: timestamp is str",isinstance(entry["timestamp"], str), True)
check("make_log: timestamp has Z", entry["timestamp"].endswith("Z"), True)

entry2 = make_log("error msg", "error")
check("make_log: error level",     entry2["level"], "error")

entry3 = make_log("done!", "success")
check("make_log: success level",   entry3["level"], "success")

ts = now_utc()
check("now_utc: returns string",   isinstance(ts, str), True)
check("now_utc: ends with Z",      ts.endswith("Z"), True)

# ─── DB name extraction ───────────────────────────────────────────────────────
print(f"\n{YELLOW}URI parsing:{RESET}")
check("extract_db_name: basic",    extract_db_name("mongodb://localhost:27017/taskflow"), "taskflow")
check("extract_db_name: custom",   extract_db_name("mongodb://host/mydb"), "mydb")
check("extract_db_name: fallback", extract_db_name("mongodb://host/"), "taskflow")

# ─── Multi-line / unicode operations 
print(f"\n{YELLOW}Edge cases:{RESET}")
result, _ = process_operation("uppercase", "héllo wörld")
check("uppercase: unicode chars",  result, "HÉLLO WÖRLD")

result, _ = process_operation("reverse", "12345")
check("reverse: digits",           result, "54321")

result, _ = process_operation("word_count", "a\nb\nc")
check("word_count: newlines as sep", result, "3")

long_text = "word " * 10000
result, _ = process_operation("word_count", long_text.strip())
check("word_count: 10k words",     result, "10000")

long_text2 = "a" * 50000
result, _ = process_operation("uppercase", long_text2)
check("uppercase: 50k chars",      len(result) == 50000, True)

# ─── Summary 
total = passed + failed
print(f"\n{'─' * 44}")
print(f"  {BOLD}Results: {GREEN}{passed} passed{RESET}", end="")
if failed:
    print(f"  {RED}{failed} failed{RESET}")
else:
    print(f"  {GREEN}0 failed{RESET}")
print(f"  Total : {total} tests")
print()

if failed:
    sys.exit(1)