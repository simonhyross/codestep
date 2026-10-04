/* Curriculum. Step types: learn | quiz | code.
   Code steps are graded by running `tests` (Python) after the learner's code.
   Test helpers: output, run_with(**vars), timed(fn, *args), source. */
const py = String.raw;

window.UNITS = [
{
  id: "basics", title: "Python Basics", desc: "Variables, numbers, decisions and loops", color: "blue",
  lessons: [
  { id: "hello", needs: [], title: "Hello, Python", blurb: "Print text and store values", steps: [
    { type: "learn", title: "Your first program", html: py`
      <p>A program is a list of instructions. The most famous first instruction is <code>print()</code>, which shows something on screen.</p>
      <pre data-run><code>print("Hello, world!")</code></pre>
      <p>Text goes inside quotes and is called a <b>string</b>. Numbers don't need quotes.</p>
      <p>A <b>variable</b> is a name that holds a value:</p>
      <pre data-run><code>language = "Python"
year = 1991
print(language, year)</code></pre>` },
    { type: "code", prompt: py`<p>Print exactly <code>Hello, world!</code></p>`,
      starter: py`# Write your code below
`, solution: py`print("Hello, world!")`, hint: "Put the text in quotes inside print(...).",
      tests: py`assert output.strip() == "Hello, world!", "Print exactly: Hello, world! (capital H, comma, exclamation mark)"` },
    { type: "quiz", q: "What does this code display?", code: "print(2 + 3)",
      options: ["5", "23", "2 + 3", "An error"], answer: 0, why: [null, "That would be joining text. Without quotes, + between numbers adds them.", "Only text inside quotes is shown literally. 2 + 3 is an expression, so Python evaluates it first.", "The code is valid. Adding two numbers is perfectly fine."], explain: "Without quotes Python evaluates the maths first, so it prints 5." },
    { type: "code", prompt: py`<p>Create a variable called <code>age</code> with the value <code>30</code>, then print it.</p>`,
      starter: py`# Create the variable and print it
`, solution: py`age = 30
print(age)`, hint: "age = 30 creates it. Then print(age).",
      tests: py`assert age == 30, "age should be 30"
assert output.strip() == "30", "Print the variable age"` },
  ]},
  { id: "numbers", needs: ["hello"], title: "Numbers & Strings", blurb: "Maths and f-strings", steps: [
    { type: "learn", title: "Python as a calculator", html: py`
      <p>Python understands the usual operators plus a few handy extras:</p>
      <pre><code>7 + 2    # 9      addition
7 / 2    # 3.5    true division
7 // 2   # 3      floor division
7 % 2    # 1      remainder
2 ** 10  # 1024   power</code></pre>
      <p><b>f-strings</b> put values inside text. Start the string with <code>f</code> and wrap names in braces:</p>
      <pre data-run><code>name = "Ada"
print(f"Hi {name}, 2+2 is {2 + 2}")</code></pre>` },
    { type: "quiz", q: "What is the value of this expression?", code: "7 // 2",
      options: ["3", "3.5", "4", "1"], answer: 0, why: [null, "That's what / gives. // is floor division and drops the decimals.", "// rounds down, never up: 3.5 becomes 3, not 4.", "That's the remainder (7 % 2). // gives the whole-number quotient."], explain: "// is floor division. It drops the decimal part: 3.5 becomes 3." },
    { type: "quiz", q: "What is the value of this expression?", code: "17 % 5",
      options: ["2", "3", "3.4", "12"], answer: 0, why: [null, "3 is the quotient (17 // 5). % returns what is left over.", "That's 17 / 5. % is not division, it gives the remainder.", "That's 17 - 5. % doesn't subtract, it gives what remains after dividing."], explain: "% gives the remainder: 17 = 3 x 5 + 2." },
    { type: "code", prompt: py`<p>Set <code>seconds_in_day</code> to the number of seconds in one day. Let Python do the multiplication (24 hours, 60 minutes, 60 seconds).</p>`,
      starter: py`seconds_in_day = 0
`, solution: py`seconds_in_day = 24 * 60 * 60`, hint: "Multiply 24 * 60 * 60.",
      tests: py`assert seconds_in_day == 86400, "A day has 24 * 60 * 60 = 86400 seconds"` },
    { type: "code", prompt: py`<p>Use an <b>f-string</b> to print <code>Ada is 36 years old</code> using the two variables. Your code must work for any name and age.</p>`,
      starter: py`name = "Ada"
age = 36
# print a sentence using name and age
`, solution: py`name = "Ada"
age = 36
print(f"{name} is {age} years old")`, hint: 'print(f"{name} is ... years old") and put {age} in the right spot.',
      tests: py`for n, a in [("Ada", 36), ("Grace", 45)]:
    r = run_with(name=n, age=a)
    assert r.out.strip() == f"{n} is {a} years old", "Use the variables inside an f-string, don't hardcode the text"` },
    { type: "predict", code: py`a = 17
print(a // 5, a % 5)
print(a ** 2)`,
      answer: py`3 2
289` },
  ]},
  { id: "decisions", needs: ["numbers"], title: "Decisions", blurb: "if, elif and else", steps: [
    { type: "learn", title: "Making choices", html: py`
      <p>Programs choose between paths with <code>if</code>. Indentation (4 spaces) shows which lines belong to which branch.</p>
      <pre data-run><code>temp = 22
if temp > 30:
    print("hot")
elif temp >= 15:
    print("nice")
else:
    print("cold")</code></pre>
      <p>Compare with <code>==  !=  &lt;  &gt;  &lt;=  &gt;=</code> and combine with <code>and</code>, <code>or</code>, <code>not</code>.</p>` },
    { type: "quiz", q: "What does this print?", code: py`x = 10
if x > 5 and x < 8:
    print("A")
elif x >= 10:
    print("B")
else:
    print("C")`, options: ["B", "A", "C", "Nothing"], answer: 0, why: [null, "x > 5 is true but x < 8 is false, and `and` needs BOTH sides to be true.", "else only runs when every earlier condition is false, but x >= 10 is true.", "One branch always runs here because of the else."], explain: "x > 5 and x < 8 is False (10 is not below 8), but x >= 10 is True, so B." },
    { type: "code", prompt: py`<p>Print <code>even</code> if <code>number</code> is even, otherwise <code>odd</code>. Hint: the remainder of dividing by 2.</p>`,
      starter: py`number = 7
# print "even" or "odd"
`, solution: py`number = 7
if number % 2 == 0:
    print("even")
else:
    print("odd")`, hint: "number % 2 == 0 means even.",
      tests: py`for n in (7, 10, 0, -3):
    assert run_with(number=n).out.strip() == ("even" if n % 2 == 0 else "odd"), f"Wrong answer for number = {n}"` },
    { type: "code", prompt: py`<p>Print a grade for <code>score</code>: <code>A</code> for 90+, <code>B</code> for 80+, <code>C</code> for 70+, otherwise <code>F</code>.</p>`,
      starter: py`score = 85
`, solution: py`score = 85
if score >= 90:
    print("A")
elif score >= 80:
    print("B")
elif score >= 70:
    print("C")
else:
    print("F")`, hint: "Check the highest grade first with if, then elif for the others.",
      tests: py`def grade(s): return "A" if s >= 90 else "B" if s >= 80 else "C" if s >= 70 else "F"
for s in (95, 90, 85, 80, 72, 70, 40):
    assert run_with(score=s).out.strip() == grade(s), f"Wrong grade for score = {s}"` },
    { type: "predict", code: py`x = 7
if x % 2 == 0:
    print("even")
elif x > 5:
    print("big odd")
else:
    print("small odd")`,
      answer: py`big odd` },
  ]},
  { id: "loops", needs: ["decisions"], title: "Loops", blurb: "Repeat things with for and while", steps: [
    { type: "learn", title: "Doing things again", html: py`
      <p>A <code>for</code> loop repeats a block for every item in a sequence. <code>range(n)</code> gives 0 to n-1.</p>
      <pre data-run><code>for i in range(3):
    print(i)        # 0 1 2

for i in range(2, 10, 3):   # start, stop, step
    print(i)</code></pre>
      <p>A <code>while</code> loop repeats as long as a condition is true. Use <code>break</code> to leave early.</p>
      <pre data-run><code>n = 1
while n < 100:
    n *= 2</code></pre>` },
    { type: "quiz", q: "Which numbers does this produce?", code: "list(range(2, 10, 3))",
      options: ["[2, 5, 8]", "[2, 5, 8, 10]", "[3, 6, 9]", "[2, 3, 4, 5]"], answer: 0, why: [null, "range excludes the stop value, so 10 can never appear.", "The sequence starts at the first argument (2), not at the step size.", "The third argument is the step. It jumps by 3, not by 1."], explain: "range(start, stop, step) stops before 10: 2, 5, 8." },
    { type: "code", prompt: py`<p>Use a loop to add the numbers from <code>1</code> to <code>n</code> (inclusive) and store the result in <code>total</code>.</p>`,
      starter: py`n = 10
total = 0
# loop here
`, solution: py`n = 10
total = 0
for i in range(1, n + 1):
    total += i`, hint: "range(1, n + 1) includes n.",
      tests: py`for n, want in [(10, 55), (100, 5050), (0, 0), (1, 1)]:
    assert run_with(n=n).vars["total"] == want, f"With n = {n}, total should be {want}"` },
    { type: "code", prompt: py`<p><b>FizzBuzz.</b> Print the numbers 1 to 15, one per line. For multiples of 3 print <code>Fizz</code>, of 5 print <code>Buzz</code>, of both print <code>FizzBuzz</code>.</p>`,
      starter: py`# FizzBuzz from 1 to 15
`, solution: py`for i in range(1, 16):
    if i % 15 == 0:
        print("FizzBuzz")
    elif i % 3 == 0:
        print("Fizz")
    elif i % 5 == 0:
        print("Buzz")
    else:
        print(i)`, hint: "Check the 'both' case (i % 15 == 0) first.",
      tests: py`want = ["1","2","Fizz","4","Buzz","Fizz","7","8","Fizz","Buzz","11","Fizz","13","14","FizzBuzz"]
assert output.split() == want, "Output doesn't match FizzBuzz for 1..15"` },
    { type: "predict", code: py`total = 0
for n in range(1, 4):
    total += n
    print(total)`,
      answer: py`1
3
6` },
  ]},
  ]
},
{
  id: "funcs", title: "Functions & Collections", desc: "Reusable code, lists, dicts and sets", color: "yellow",
  lessons: [
  { id: "functions", needs: ["loops"], title: "Functions", blurb: "Package code for reuse", steps: [
    { type: "learn", title: "Define once, use often", html: py`
      <p>A function is a named, reusable block. It takes <b>parameters</b> and sends a value back with <code>return</code>.</p>
      <pre data-run><code>def area(width, height=1):
    return width * height

print(area(3, 4))   # 12
print(area(5))      # 5  (default height)</code></pre>
      <p><code>print</code> shows a value; <code>return</code> hands it back to the caller. A function without <code>return</code> gives back <code>None</code>.</p>` },
    { type: "quiz", q: "What does this print?", code: py`def double(x):
    x * 2

print(double(4))`, options: ["None", "8", "4", "An error"], answer: 0, why: [null, "The function computes x * 2 but never returns it, so the caller gets nothing back.", "4 is what you passed in. print shows what the function returns, and it returns nothing.", "The code is valid. A function without return simply returns None."], explain: "The function never returns anything, so the result is None." },
    { type: "code", prompt: py`<p>Write <code>square(x)</code> that returns <code>x</code> multiplied by itself.</p>`,
      starter: py`def square(x):
    pass
`, solution: py`def square(x):
    return x * x`, hint: "return x * x",
      tests: py`assert square(4) == 16, "square(4) should be 16"
assert square(-3) == 9
assert square(0) == 0` },
    { type: "code", prompt: py`<p>Write <code>greet(name, greeting="Hello")</code> that returns text like <code>Hello, Ada!</code>.</p>`,
      starter: py`def greet(name, greeting="Hello"):
    pass
`, solution: py`def greet(name, greeting="Hello"):
    return f"{greeting}, {name}!"`, hint: 'return f"{greeting}, {name}!"',
      tests: py`assert greet("Ada") == "Hello, Ada!"
assert greet("Ada", "Hi") == "Hi, Ada!"` },
    { type: "code", prompt: py`<p>Write <code>clamp(value, low, high)</code>: return <code>low</code> if value is below it, <code>high</code> if above, else the value.</p>`,
      starter: py`def clamp(value, low, high):
    pass
`, solution: py`def clamp(value, low, high):
    if value < low:
        return low
    if value > high:
        return high
    return value`, hint: "Two if statements, each with its own return.",
      tests: py`assert clamp(5, 0, 10) == 5
assert clamp(-5, 0, 10) == 0
assert clamp(50, 0, 10) == 10
assert clamp(10, 0, 10) == 10` },
    { type: "predict", code: py`def shout(word, times=2):
    return (word + "!") * times

print(shout("hi"))
print(shout("ok", 1))`,
      answer: py`hi!hi!
ok!` },
  ]},
  { id: "lists", needs: ["loops"], title: "Lists", blurb: "Ordered collections", steps: [
    { type: "learn", title: "Lists hold many values", html: py`
      <pre data-run><code>nums = [10, 20, 30, 40]
nums[0]        # 10   (first)
nums[-1]       # 40   (last)
nums[1:3]      # [20, 30]  slice, stop excluded
nums.append(50)
len(nums)      # 5

for n in nums:
    print(n)</code></pre>
      <p>Lists are <b>mutable</b>: you can change them in place. Indexing by position is fast, O(1).</p>` },
    { type: "quiz", q: "What is the value?", code: py`nums = [10, 20, 30, 40]
nums[1:3]`, options: ["[20, 30]", "[10, 20, 30]", "[20, 30, 40]", "[10, 20]"], answer: 0, why: [null, "Indexes start at 0, so index 1 holds 20, not 10.", "The stop index is excluded, so index 3 (the 40) isn't part of the slice.", "That's nums[0:2]. This slice starts at index 1."], explain: "A slice starts at index 1 and stops before index 3." },
    { type: "code", prompt: py`<p>Write <code>evens(nums)</code> returning a new list with only the even numbers, keeping their order.</p>`,
      starter: py`def evens(nums):
    pass
`, solution: py`def evens(nums):
    result = []
    for n in nums:
        if n % 2 == 0:
            result.append(n)
    return result`, hint: "Start with an empty list, loop, and append the matches.",
      tests: py`assert evens([1, 2, 3, 4, 5, 6]) == [2, 4, 6]
assert evens([1, 3]) == []
assert evens([]) == []
assert evens([-2, 7, 0]) == [-2, 0]` },
    { type: "code", prompt: py`<p>Write <code>rotate_left(lst)</code> returning a new list where the first item moved to the end. <code>[1,2,3]</code> becomes <code>[2,3,1]</code>. An empty list stays empty.</p>`,
      starter: py`def rotate_left(lst):
    pass
`, solution: py`def rotate_left(lst):
    return lst[1:] + lst[:1]`, hint: "Slices: lst[1:] is everything but the first, lst[:1] is just the first.",
      tests: py`a = [1, 2, 3]
assert rotate_left(a) == [2, 3, 1]
assert a == [1, 2, 3], "Don't change the original list"
assert rotate_left([]) == []
assert rotate_left([9]) == [9]` },
    { type: "predict", code: py`a = [1, 2, 3]
b = a
b.append(4)
print(a)
print(len(b))`,
      answer: py`[1, 2, 3, 4]
4` },
  ]},
  { id: "dicts", needs: ["lists"], title: "Dicts & Sets", blurb: "Look things up by key", steps: [
    { type: "learn", title: "Key → value", html: py`
      <p>A <b>dict</b> maps keys to values. Lookup by key is very fast.</p>
      <pre data-run><code>ages = {"Ada": 36, "Linus": 54}
ages["Ada"]              # 36
ages["Grace"] = 45       # add
ages.get("Bob", 0)       # 0  (default if missing)
for name, age in ages.items():
    print(name, age)</code></pre>
      <p>A <b>set</b> stores unique values: <code>set([1, 1, 2])</code> is <code>{1, 2}</code>. Checking <code>x in my_set</code> is fast too.</p>` },
    { type: "quiz", q: "What is len(set([1, 1, 2, 3, 3]))?", options: ["3", "5", "2", "4"], answer: 0, why: [null, "5 is the length of the list. A set drops the duplicates.", "The distinct values are 1, 2 and 3. That's three, not two.", "The repeated 1s and 3s each collapse into one. Count the distinct values: 1, 2, 3."], explain: "Duplicates collapse, leaving {1, 2, 3}." },
    { type: "code", prompt: py`<p>Write <code>word_count(text)</code> returning a dict of how often each word appears. Ignore case and split on spaces.</p><p><code>word_count("a B a")</code> gives <code>{"a": 2, "b": 1}</code></p>`,
      starter: py`def word_count(text):
    pass
`, solution: py`def word_count(text):
    counts = {}
    for word in text.lower().split():
        counts[word] = counts.get(word, 0) + 1
    return counts`, hint: "counts[word] = counts.get(word, 0) + 1",
      tests: py`assert word_count("a B a") == {"a": 2, "b": 1}
assert word_count("The the THE") == {"the": 3}
assert word_count("") == {}` },
    { type: "code", prompt: py`<p>Write <code>unique_sorted(items)</code> returning the distinct items as a sorted list.</p>`,
      starter: py`def unique_sorted(items):
    pass
`, solution: py`def unique_sorted(items):
    return sorted(set(items))`, hint: "set() removes duplicates, sorted() orders them.",
      tests: py`assert unique_sorted([3, 1, 3, 2, 1]) == [1, 2, 3]
assert unique_sorted([]) == []
assert unique_sorted(["b", "a", "b"]) == ["a", "b"]` },
    { type: "predict", code: py`stock = {"apples": 3}
stock["pears"] = stock.get("pears", 0) + 2
stock["apples"] += 1
print(stock)`,
      answer: py`{'apples': 4, 'pears': 2}` },
  ]},
  { id: "comprehensions", needs: ["lists", "functions"], title: "Comprehensions", blurb: "Build collections in one line", steps: [
    { type: "learn", title: "Loops in one line", html: py`
      <p>A <b>comprehension</b> builds a list (or dict, set) from a loop, concisely:</p>
      <pre data-run><code>squares = [x * x for x in range(5)]       # [0, 1, 4, 9, 16]
evens = [x for x in range(10) if x % 2 == 0]
lengths = {w: len(w) for w in ["hi", "python"]}</code></pre>
      <p>Pattern: <code>[expression for item in iterable if condition]</code>.</p>` },
    { type: "quiz", q: "What does this produce?", code: "[x * x for x in range(4)]", options: ["[0, 1, 4, 9]", "[1, 4, 9, 16]", "[0, 1, 2, 3]", "[0, 2, 4, 6]"], answer: 0, why: [null, "range(4) starts at 0, not 1, so the first square is 0.", "That's the plain range. Each x is also squared by the expression x * x.", "That would be x * 2. The expression here is x * x."], explain: "range(4) is 0, 1, 2, 3, and each one is squared." },
    { type: "code", prompt: py`<p>Write <code>squares_of_evens(nums)</code> that returns the squares of the even numbers, using a list comprehension.</p>`,
      starter: py`def squares_of_evens(nums):
    pass
`, solution: py`def squares_of_evens(nums):
    return [n * n for n in nums if n % 2 == 0]`, hint: "[n * n for n in nums if ...]",
      tests: py`assert squares_of_evens([1, 2, 3, 4]) == [4, 16]
assert squares_of_evens([]) == []
assert squares_of_evens([5, 7]) == []` },
    { type: "code", prompt: py`<p>Write <code>flatten(matrix)</code> turning a list of lists into one flat list: <code>[[1,2],[3]]</code> becomes <code>[1,2,3]</code>.</p>`,
      starter: py`def flatten(matrix):
    pass
`, solution: py`def flatten(matrix):
    return [x for row in matrix for x in row]`, hint: "Two for clauses: for row in matrix for x in row.",
      tests: py`assert flatten([[1, 2], [3], []]) == [1, 2, 3]
assert flatten([]) == []` },
    { type: "code", prompt: py`<p>Write <code>lengths(words)</code> returning a dict mapping each word to its length (dict comprehension).</p>`,
      starter: py`def lengths(words):
    pass
`, solution: py`def lengths(words):
    return {w: len(w) for w in words}`, hint: "{key: value for item in iterable}",
      tests: py`assert lengths(["hi", "python"]) == {"hi": 2, "python": 6}
assert lengths([]) == {}` },
    { type: "predict", code: py`words = ["tea", "coffee", "milk"]
print([w.upper() for w in words if len(w) > 3])`,
      answer: py`['COFFEE', 'MILK']` },
  ]},
  ]
},
{
  id: "ds", title: "Data Structures", desc: "Stacks, queues, linked lists, hashing and trees", color: "sky",
  lessons: [
  { id: "stacks", needs: ["lists", "functions"], title: "Stacks", blurb: "Last in, first out", steps: [
    { type: "learn", title: "Think of a stack of plates", html: py`
      <p>A <b>stack</b> is last-in, first-out (LIFO). You only touch the top. In Python a list works perfectly:</p>
      <pre data-run><code>stack = []
stack.append("a")   # push
stack.append("b")
stack.pop()         # "b"  (pop from top)
stack[-1]           # peek</code></pre>
      <p>Both push and pop are <b>O(1)</b>. Stacks power undo buttons, browser history, the call stack, and bracket matching.</p>` },
    { type: "quiz", q: "After these operations, what does the last pop return?", code: py`s = []
s.append(1); s.append(2); s.append(3)
s.pop()
s.pop()`, options: ["2", "3", "1", "None"], answer: 0, why: [null, "3 was removed by the first pop. The second pop returns the next top, 2.", "1 is at the bottom. A stack removes from the top, so 1 comes out last.", "The stack still had items after the first pop, so the second pop returns a real value."], explain: "The first pop removes 3, the second removes 2 (the new top)." },
    { type: "code", prompt: py`<p>Write <code>is_balanced(text)</code> returning <code>True</code> if every <code>() [] {}</code> bracket is closed correctly. Ignore other characters.</p>`,
      starter: py`def is_balanced(text):
    pass
`, solution: py`def is_balanced(text):
    pairs = {")": "(", "]": "[", "}": "{"}
    stack = []
    for ch in text:
        if ch in "([{":
            stack.append(ch)
        elif ch in pairs:
            if not stack or stack.pop() != pairs[ch]:
                return False
    return not stack`, hint: "Push openers. On a closer, pop and compare. At the end the stack must be empty.",
      tests: py`assert is_balanced("([]{})") is True
assert is_balanced("(]") is False
assert is_balanced("((") is False
assert is_balanced("())") is False
assert is_balanced("") is True
assert is_balanced("a(b)c[d]") is True` },
    { type: "code", prompt: py`<p>Evaluate a postfix (RPN) expression. <code>evaluate_rpn(["2","3","+","4","*"])</code> is <code>(2+3)*4 = 20</code>. Support <code>+ - * </code>.</p>`,
      starter: py`def evaluate_rpn(tokens):
    pass
`, solution: py`def evaluate_rpn(tokens):
    stack = []
    for t in tokens:
        if t in "+-*":
            b, a = stack.pop(), stack.pop()
            stack.append(a + b if t == "+" else a - b if t == "-" else a * b)
        else:
            stack.append(int(t))
    return stack.pop()`, hint: "Numbers get pushed. An operator pops two values (careful: second pop is the left operand).",
      tests: py`assert evaluate_rpn(["2", "3", "+", "4", "*"]) == 20
assert evaluate_rpn(["5", "1", "2", "+", "4", "*", "+", "3", "-"]) == 14
assert evaluate_rpn(["7"]) == 7
assert evaluate_rpn(["9", "3", "-"]) == 6` },
    { type: "predict", code: py`stack = []
for ch in "abc":
    stack.append(ch)
print(stack.pop())
print(stack)`,
      answer: py`c
['a', 'b']` },
  ]},
  { id: "queues", needs: ["stacks"], title: "Queues", blurb: "First in, first out", steps: [
    { type: "learn", title: "Waiting in line", html: py`
      <p>A <b>queue</b> is first-in, first-out (FIFO). New items join the back; items leave from the front.</p>
      <p>Don't use <code>list.pop(0)</code>: it shifts every element, so it's <b>O(n)</b>. Use <code>collections.deque</code>, where both ends are <b>O(1)</b>:</p>
      <pre data-run><code>from collections import deque
q = deque()
q.append("a")      # enqueue
q.append("b")
q.popleft()        # "a"  dequeue</code></pre>` },
    { type: "quiz", q: "Print jobs must be handled in the order they were submitted. Which structure fits?", options: ["Queue", "Stack", "Set", "Tree"], answer: 0, why: [null, "A stack serves the newest item first (LIFO), so the newest job would print first.", "Sets have no order, so they can't guarantee submission order.", "Trees organise hierarchies or sorted data, not arrival order."], explain: "First submitted, first printed: that is FIFO." },
    { type: "code", prompt: py`<p>Finish the <code>Queue</code> class. <code>dequeue()</code> on an empty queue should raise <code>IndexError</code>.</p>`,
      starter: py`from collections import deque

class Queue:
    def __init__(self):
        self.items = deque()

    def enqueue(self, item):
        pass

    def dequeue(self):
        pass

    def is_empty(self):
        pass

    def size(self):
        pass
`, solution: py`from collections import deque

class Queue:
    def __init__(self):
        self.items = deque()

    def enqueue(self, item):
        self.items.append(item)

    def dequeue(self):
        if not self.items:
            raise IndexError("queue is empty")
        return self.items.popleft()

    def is_empty(self):
        return len(self.items) == 0

    def size(self):
        return len(self.items)`, hint: "append() to enqueue, popleft() to dequeue.",
      tests: py`q = Queue()
assert q.is_empty() is True
q.enqueue(1); q.enqueue(2); q.enqueue(3)
assert q.size() == 3
assert q.dequeue() == 1
assert q.dequeue() == 2
assert q.is_empty() is False
q.dequeue()
try:
    q.dequeue()
    assert False, "dequeue on an empty queue should raise IndexError"
except IndexError:
    pass` },
    { type: "predict", code: py`from collections import deque

q = deque([1, 2, 3])
q.append(4)
print(q.popleft(), q.popleft())
print(list(q))`,
      answer: py`1 2
[3, 4]` },
  ]},
  { id: "linked", needs: ["stacks", "recursion"], title: "Linked Lists", blurb: "Nodes pointing to nodes", steps: [
    { type: "learn", title: "A chain of nodes", html: py`
      <p>A <b>linked list</b> stores each value in a node that points to the next one. No contiguous memory is needed.</p>
      <pre data-run><code>class Node:
    def __init__(self, value, next=None):
        self.value = value
        self.next = next

head = Node(1, Node(2, Node(3)))   # 1 -> 2 -> 3</code></pre>
      <p>Inserting at the head is <b>O(1)</b>, but reaching the k-th item means walking k nodes: <b>O(n)</b>. Lists are the opposite.</p>` },
    { type: "quiz", q: "Why is reading the 500th item of a linked list slower than in a Python list?", options: ["You must walk through 499 nodes first", "Linked lists are always sorted", "Nodes are stored on disk", "Python forbids indexing"], answer: 0, why: [null, "Linked lists have no sorting guarantee, and order has nothing to do with access speed.", "Nodes live in memory like everything else. The cost comes from following pointers.", "You can write indexing for a linked list. It just has to walk node by node."], explain: "There is no index math. You follow next pointers one at a time: O(n)." },
    { type: "code", prompt: py`<p>Implement <code>prepend(head, value)</code> (returns the new head) and <code>to_list(head)</code> (returns the values as a Python list).</p>`,
      starter: py`class Node:
    def __init__(self, value, next=None):
        self.value = value
        self.next = next

def prepend(head, value):
    pass

def to_list(head):
    pass
`, solution: py`class Node:
    def __init__(self, value, next=None):
        self.value = value
        self.next = next

def prepend(head, value):
    return Node(value, head)

def to_list(head):
    out = []
    while head:
        out.append(head.value)
        head = head.next
    return out`, hint: "prepend: the new node's next is the old head. to_list: loop while the current node is not None.",
      tests: py`head = None
for v in [3, 2, 1]:
    head = prepend(head, v)
assert to_list(head) == [1, 2, 3]
assert to_list(None) == []` },
    { type: "code", prompt: py`<p>Write <code>reverse(head)</code> that reverses the list in O(n) time and returns the new head.</p>`,
      starter: py`class Node:
    def __init__(self, value, next=None):
        self.value = value
        self.next = next

def reverse(head):
    pass
`, solution: py`class Node:
    def __init__(self, value, next=None):
        self.value = value
        self.next = next

def reverse(head):
    prev = None
    while head:
        head.next, prev, head = prev, head, head.next
    return prev`, hint: "Walk the list keeping prev. Point each node's next to prev, then advance.",
      tests: py`def build(vals):
    h = None
    for v in reversed(vals):
        h = Node(v, h)
    return h
def dump(h):
    out = []
    while h:
        out.append(h.value); h = h.next
    return out
assert dump(reverse(build([1, 2, 3, 4]))) == [4, 3, 2, 1]
assert dump(reverse(build([1]))) == [1]
assert reverse(None) is None` },
  ]},
  { id: "hashing", needs: ["dicts"], title: "Hash Maps", blurb: "How dicts are so fast", steps: [
    { type: "learn", title: "Hashing in a nutshell", html: py`
      <p>A dict turns each key into a number with a <b>hash function</b>, and uses it to jump straight to the right slot. That's why lookup, insert and delete are <b>O(1)</b> on average.</p>
      <p>Keys must be <b>hashable</b> (immutable): strings, numbers and tuples work; lists and dicts don't.</p>
      <pre data-run><code>seen = {}
seen[(1, 2)] = "ok"       # tuple key: fine
# seen[[1, 2]] = "no"     # TypeError: unhashable type</code></pre>
      <p>Whenever you catch yourself searching a list again and again, ask: <i>could a dict or set do this?</i></p>` },
    { type: "quiz", q: "Which of these can be used as a dict key?", options: ["(3, 4)", "[3, 4]", "{3, 4}", "{'a': 1}"], answer: 0, why: [null, "Lists are mutable, so their hash could change. Python marks them unhashable.", "Sets are mutable and therefore unhashable. (A frozenset would work.)", "Dicts are mutable and unhashable."], explain: "Tuples are immutable and hashable. Lists, sets and dicts are mutable." },
    { type: "code", prompt: py`<p>Write <code>first_unique(s)</code> returning the first character that appears exactly once, or <code>None</code>.</p>`,
      starter: py`def first_unique(s):
    pass
`, solution: py`def first_unique(s):
    counts = {}
    for ch in s:
        counts[ch] = counts.get(ch, 0) + 1
    for ch in s:
        if counts[ch] == 1:
            return ch
    return None`, hint: "Pass 1: count characters. Pass 2: return the first with count 1.",
      tests: py`assert first_unique("swiss") == "w"
assert first_unique("aabb") is None
assert first_unique("") is None
assert first_unique("python") == "p"` },
    { type: "code", prompt: py`<p>Write <code>group_anagrams(words)</code> returning a list of groups of words that are anagrams. Keep groups in order of first appearance and words in input order.</p>`,
      starter: py`def group_anagrams(words):
    pass
`, solution: py`def group_anagrams(words):
    groups = {}
    for w in words:
        groups.setdefault("".join(sorted(w)), []).append(w)
    return list(groups.values())`, hint: "Use the sorted letters of each word as the dict key.",
      tests: py`got = group_anagrams(["eat", "tea", "tan", "ate", "nat", "bat"])
assert got == [["eat", "tea", "ate"], ["tan", "nat"], ["bat"]], f"Got {got}"
assert group_anagrams([]) == []` },
    { type: "predict", code: py`seen = set()
for x in [1, 2, 2, 3, 1]:
    if x in seen:
        print("dup", x)
    seen.add(x)`,
      answer: py`dup 2
dup 1` },
  ]},
  { id: "trees", needs: ["linked"], title: "Binary Trees", blurb: "Hierarchies and search trees", steps: [
    { type: "learn", title: "Trees branch", html: py`
      <p>A <b>tree</b> is nodes with children. In a <b>binary search tree</b> (BST) every node has at most two children: smaller values go left, larger go right.</p>
      <pre><code>        8
       / \
      3   10
     / \    \
    1   6    14</code></pre>
      <p>Searching follows one branch per level, so a balanced BST needs only about <b>log₂ n</b> steps. An <b>in-order traversal</b> (left, node, right) visits values in sorted order.</p>` },
    { type: "quiz", q: "What does an in-order traversal of a binary search tree produce?", options: ["Values in sorted order", "Values in reverse order", "Values in insertion order", "Only leaf values"], answer: 0, why: [null, "Reverse order would need right, node, left. In-order goes left first.", "The shape of the tree comes from comparisons, not from arrival order.", "In-order visits every node, not just the leaves."], explain: "Left subtree (smaller), then the node, then right subtree (larger): sorted." },
    { type: "code", prompt: py`<p>Build a BST <code>Node</code> with <code>insert(value)</code> (ignore duplicates) and <code>inorder()</code> returning a sorted list.</p>`,
      starter: py`class Node:
    def __init__(self, value):
        self.value = value
        self.left = None
        self.right = None

    def insert(self, value):
        pass

    def inorder(self):
        pass
`, solution: py`class Node:
    def __init__(self, value):
        self.value = value
        self.left = None
        self.right = None

    def insert(self, value):
        if value < self.value:
            if self.left is None:
                self.left = Node(value)
            else:
                self.left.insert(value)
        elif value > self.value:
            if self.right is None:
                self.right = Node(value)
            else:
                self.right.insert(value)

    def inorder(self):
        left = self.left.inorder() if self.left else []
        right = self.right.inorder() if self.right else []
        return left + [self.value] + right`, hint: "Recurse into the left or right child. inorder = left + [self.value] + right.",
      tests: py`root = Node(8)
for v in [3, 10, 1, 6, 14, 3, 8]:
    root.insert(v)
assert root.inorder() == [1, 3, 6, 8, 10, 14]
assert Node(5).inorder() == [5]` },
    { type: "code", prompt: py`<p>Add <code>contains(value)</code> and <code>height()</code> (a single node has height 1).</p>`,
      starter: py`class Node:
    def __init__(self, value):
        self.value = value
        self.left = None
        self.right = None

    def insert(self, value):
        if value < self.value:
            if self.left is None:
                self.left = Node(value)
            else:
                self.left.insert(value)
        elif value > self.value:
            if self.right is None:
                self.right = Node(value)
            else:
                self.right.insert(value)

    def contains(self, value):
        pass

    def height(self):
        pass
`, solution: py`class Node:
    def __init__(self, value):
        self.value = value
        self.left = None
        self.right = None

    def insert(self, value):
        if value < self.value:
            if self.left is None:
                self.left = Node(value)
            else:
                self.left.insert(value)
        elif value > self.value:
            if self.right is None:
                self.right = Node(value)
            else:
                self.right.insert(value)

    def contains(self, value):
        if value == self.value:
            return True
        child = self.left if value < self.value else self.right
        return child.contains(value) if child else False

    def height(self):
        lh = self.left.height() if self.left else 0
        rh = self.right.height() if self.right else 0
        return 1 + max(lh, rh)`, hint: "contains: go left or right depending on the value. height: 1 + the taller child.",
      tests: py`root = Node(8)
for v in [3, 10, 1, 6, 14]:
    root.insert(v)
assert root.contains(6) is True
assert root.contains(7) is False
assert root.contains(8) is True
assert root.height() == 3
assert Node(1).height() == 1` },
  ]},
  ]
},
{
  id: "algos", title: "Algorithms", desc: "Searching, sorting, recursion and graphs", color: "orange",
  lessons: [
  { id: "linear", needs: ["lists", "dicts"], title: "Linear Search", blurb: "Check items one by one", steps: [
    { type: "learn", title: "The simplest search", html: py`
      <p><b>Linear search</b> checks each item until it finds the target. It works on any list, sorted or not.</p>
      <pre data-run><code>def contains(arr, target):
    for x in arr:
        if x == target:
            return True
    return False

print(contains([4, 2, 7], 7))</code></pre>
      <p>In the worst case (target missing) it checks all <i>n</i> items: <b>O(n)</b>.</p>` },
    { type: "quiz", q: "A list has 1000 items and the target is not in it. How many comparisons does linear search make?", options: ["1000", "10", "500", "1"], answer: 0, why: [null, "10 is far too few. Linear search can't skip items it hasn't looked at.", "~500 is the average when the item IS present. A missing item forces a full scan.", "1 is the best case (target first). Here the target isn't in the list at all."], explain: "It has to rule out every single item." },
    { type: "code", prompt: py`<p>Write <code>linear_search(arr, target)</code> returning the index of the first match, or <code>-1</code>.</p>`,
      starter: py`def linear_search(arr, target):
    pass
`, solution: py`def linear_search(arr, target):
    for i, x in enumerate(arr):
        if x == target:
            return i
    return -1`, hint: "enumerate(arr) gives (index, value) pairs.",
      tests: py`assert linear_search([4, 2, 7, 2], 2) == 1
assert linear_search([4, 2, 7], 9) == -1
assert linear_search([], 1) == -1
assert linear_search(["a", "b"], "b") == 1` },
    { type: "code", prompt: py`<p>Write <code>find_max(arr)</code> without using <code>max()</code>. Return <code>None</code> for an empty list.</p>`,
      starter: py`def find_max(arr):
    pass
`, solution: py`def find_max(arr):
    if not arr:
        return None
    best = arr[0]
    for x in arr:
        if x > best:
            best = x
    return best`, hint: "Remember the best so far and update it as you scan.",
      tests: py`import re
assert not re.search(r"\bmax\(", source), "Please don't use the built-in max()"
assert find_max([3, 9, 2]) == 9
assert find_max([-5, -2, -9]) == -2
assert find_max([7]) == 7
assert find_max([]) is None` },
  ]},
  { id: "binary", needs: ["linear"], title: "Binary Search", blurb: "Halve the problem each step", steps: [
    { type: "learn", title: "Guess the number", html: py`
      <p>If a list is <b>sorted</b>, check the middle. Too high? Discard the upper half. Too low? Discard the lower half. Repeat.</p>
      <pre><code>lo, hi = 0, len(arr) - 1
while lo <= hi:
    mid = (lo + hi) // 2
    if arr[mid] == target: ...
    elif arr[mid] < target: lo = mid + 1
    else: hi = mid - 1</code></pre>
      <p>Each step halves the search space, so 1,000,000 items need at most ~20 steps: <b>O(log n)</b>.</p>` },
    { type: "quiz", q: "About how many steps does binary search need, at most, for 1,000,000 sorted items?", options: ["20", "1,000", "500,000", "1,000,000"], answer: 0, why: [null, "1,000 is far too many. Halving a million items reaches 1 within 20 steps.", "500,000 is about what linear search averages. Each binary step halves the range instead.", "1,000,000 is linear search's worst case. Binary search discards half the items every step."], explain: "2²⁰ is about a million, so you can halve 20 times." },
    { type: "code", prompt: py`<p>Write <code>binary_search(arr, target)</code> returning the index or <code>-1</code>. The tests use a 1,000,000 item list and punish scanning, so you must really halve the range.</p>`,
      starter: py`def binary_search(arr, target):
    pass
`, solution: py`def binary_search(arr, target):
    lo, hi = 0, len(arr) - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if arr[mid] == target:
            return mid
        if arr[mid] < target:
            lo = mid + 1
        else:
            hi = mid - 1
    return -1`, hint: "Keep lo and hi. Compare arr[mid] with target and move lo or hi past mid.",
      tests: py`class Counting(list):
    reads = 0
    def __getitem__(self, i):
        Counting.reads += 1
        return list.__getitem__(self, i)
    def _no(self, *a, **k):
        raise AssertionError("Don't scan the whole list. Halve the search range instead.")
    __iter__ = index = __contains__ = count = _no

big = Counting(range(0, 2_000_000, 2))
assert binary_search(big, 1_234_568) == 617_284
assert Counting.reads <= 45, f"Used {Counting.reads} reads. Binary search needs about 21."
assert binary_search(big, 7) == -1
assert binary_search([], 3) == -1
assert binary_search([5], 5) == 0
assert binary_search([1, 3, 5, 7], 7) == 3
assert binary_search([1, 3, 5, 7], 1) == 0` },
    { type: "code", prompt: py`<p>Write <code>lower_bound(arr, x)</code>: the first index whose value is <code>&gt;= x</code> (or <code>len(arr)</code> if none). It's the insertion point that keeps the list sorted.</p>`,
      starter: py`def lower_bound(arr, x):
    pass
`, solution: py`def lower_bound(arr, x):
    lo, hi = 0, len(arr)
    while lo < hi:
        mid = (lo + hi) // 2
        if arr[mid] < x:
            lo = mid + 1
        else:
            hi = mid
    return lo`, hint: "Use lo=0, hi=len(arr). If arr[mid] < x move lo up, else set hi = mid.",
      tests: py`assert lower_bound([1, 3, 3, 5], 3) == 1
assert lower_bound([1, 3, 3, 5], 4) == 3
assert lower_bound([1, 3, 3, 5], 0) == 0
assert lower_bound([1, 3, 3, 5], 9) == 4
assert lower_bound([], 1) == 0` },
    { type: "predict", code: py`arr = [1, 3, 5, 7, 9]
lo, hi = 0, len(arr) - 1
while lo <= hi:
    mid = (lo + hi) // 2
    print(mid)
    if arr[mid] < 7:
        lo = mid + 1
    else:
        hi = mid - 1`,
      answer: py`2
3` },
  ]},
  { id: "sorting", needs: ["linear", "recursion"], title: "Sorting", blurb: "Bubble, selection and friends", steps: [
    { type: "learn", title: "Putting things in order", html: py`
      <p>Simple sorts compare and swap items repeatedly.</p>
      <ul>
        <li><b>Bubble sort</b>: repeatedly swap neighbours that are out of order.</li>
        <li><b>Selection sort</b>: pick the smallest remaining item and put it next.</li>
      </ul>
      <p>Both use two nested loops, so they take <b>O(n²)</b> time. Python's built-in <code>sorted()</code> uses Timsort: <b>O(n log n)</b>. In real code, use it!</p>` },
    { type: "quiz", q: "After ONE full pass of bubble sort over [4, 2, 3, 1], what is the list?", options: ["[2, 3, 1, 4]", "[1, 2, 3, 4]", "[2, 4, 3, 1]", "[1, 4, 2, 3]"], answer: 0, why: [null, "That would take several passes. One pass only carries the largest value to the end.", "That's the state after just the first swap. A pass keeps comparing neighbours until the end.", "Bubble sort only swaps neighbours, so it can never jump a 1 to the front in one pass."], explain: "The largest value (4) bubbles to the end: [2,4,3,1] → [2,3,4,1] → [2,3,1,4]." },
    { type: "code", prompt: py`<p>Write <code>selection_sort(arr)</code> returning a new sorted list. Do not use <code>sorted()</code> or <code>.sort()</code> and don't modify the input.</p>`,
      starter: py`def selection_sort(arr):
    pass
`, solution: py`def selection_sort(arr):
    a = list(arr)
    for i in range(len(a)):
        smallest = i
        for j in range(i + 1, len(a)):
            if a[j] < a[smallest]:
                smallest = j
        a[i], a[smallest] = a[smallest], a[i]
    return a`, hint: "Copy the list, then for each i find the smallest in a[i:] and swap it into place.",
      tests: py`assert "sorted(" not in source and ".sort(" not in source, "Implement the sort yourself"
data = [5, 2, 9, 1, 5, 6]
assert selection_sort(data) == [1, 2, 5, 5, 6, 9]
assert data == [5, 2, 9, 1, 5, 6], "Don't modify the original list"
assert selection_sort([]) == []
assert selection_sort([1]) == [1]` },
    { type: "code", prompt: py`<p>Write <code>bubble_swaps(arr)</code>: how many swaps does bubble sort perform to sort <code>arr</code>? (Don't change the input.)</p>`,
      starter: py`def bubble_swaps(arr):
    pass
`, solution: py`def bubble_swaps(arr):
    a = list(arr)
    swaps = 0
    for i in range(len(a)):
        for j in range(len(a) - 1 - i):
            if a[j] > a[j + 1]:
                a[j], a[j + 1] = a[j + 1], a[j]
                swaps += 1
    return swaps`, hint: "Run bubble sort on a copy and count each swap.",
      tests: py`assert bubble_swaps([3, 2, 1]) == 3
assert bubble_swaps([1, 2, 3]) == 0
assert bubble_swaps([2, 1, 3, 0]) == 4
assert bubble_swaps([]) == 0` },
    { type: "predict", code: py`data = [3, 1, 2]
for i in range(len(data) - 1):
    if data[i] > data[i + 1]:
        data[i], data[i + 1] = data[i + 1], data[i]
print(data)`,
      answer: py`[1, 2, 3]` },
  ]},
  { id: "merge", needs: ["sorting"], title: "Merge Sort", blurb: "Divide and conquer", steps: [
    { type: "learn", title: "Split, sort, merge", html: py`
      <p><b>Divide and conquer</b>: split the list in half, sort each half recursively, then <b>merge</b> two sorted halves into one.</p>
      <pre><code>def merge_sort(a):
    if len(a) <= 1:
        return a
    mid = len(a) // 2
    return merge(merge_sort(a[:mid]), merge_sort(a[mid:]))</code></pre>
      <p>There are log₂ n levels of splitting and each level does O(n) merging work: <b>O(n log n)</b>, a big win over O(n²).</p>` },
    { type: "quiz", q: "Why is merge sort O(n log n)?", options: ["log n levels of splitting, each doing O(n) merge work", "It compares every pair of items", "It sorts in place without extra memory", "It only looks at half the items"], answer: 0, why: [null, "Comparing every pair is O(n²), which is what the simple sorts do.", "Merge sort builds new lists while merging, and in-place has nothing to do with its time.", "Every item is touched on each level while merging, not just half."], explain: "Halving gives log n levels; every level touches all n items once while merging." },
    { type: "code", prompt: py`<p>Write <code>merge(a, b)</code>: combine two <b>already sorted</b> lists into one sorted list in O(n).</p>`,
      starter: py`def merge(a, b):
    pass
`, solution: py`def merge(a, b):
    i = j = 0
    out = []
    while i < len(a) and j < len(b):
        if a[i] <= b[j]:
            out.append(a[i]); i += 1
        else:
            out.append(b[j]); j += 1
    out.extend(a[i:])
    out.extend(b[j:])
    return out`, hint: "Two pointers, always take the smaller front item. Then append what's left.",
      tests: py`assert merge([1, 4, 7], [2, 3, 9]) == [1, 2, 3, 4, 7, 9]
assert merge([], [1]) == [1]
assert merge([1], []) == [1]
assert merge([], []) == []
assert merge([1, 1], [1]) == [1, 1, 1]` },
    { type: "code", prompt: py`<p>Now write <code>merge_sort(arr)</code> (returns a new list). The tests sort 20,000 numbers, so it must be fast.</p>`,
      starter: py`def merge(a, b):
    i = j = 0
    out = []
    while i < len(a) and j < len(b):
        if a[i] <= b[j]:
            out.append(a[i]); i += 1
        else:
            out.append(b[j]); j += 1
    out.extend(a[i:])
    out.extend(b[j:])
    return out

def merge_sort(arr):
    pass
`, solution: py`def merge(a, b):
    i = j = 0
    out = []
    while i < len(a) and j < len(b):
        if a[i] <= b[j]:
            out.append(a[i]); i += 1
        else:
            out.append(b[j]); j += 1
    out.extend(a[i:])
    out.extend(b[j:])
    return out

def merge_sort(arr):
    if len(arr) <= 1:
        return list(arr)
    mid = len(arr) // 2
    return merge(merge_sort(arr[:mid]), merge_sort(arr[mid:]))`, hint: "Base case: length <= 1. Otherwise merge the sorted halves.",
      tests: py`import random
random.seed(1)
data = [random.randint(0, 10**6) for _ in range(20000)]
copy = list(data)
res, t = timed(merge_sort, data)
assert res == sorted(copy), "The result isn't sorted correctly"
assert data == copy, "Don't modify the input list"
assert t < 2, "Too slow. Are you doing O(n log n) work?"
assert merge_sort([]) == [] and merge_sort([2, 1]) == [1, 2]` },
  ]},
  { id: "recursion", needs: ["functions"], title: "Recursion", blurb: "Functions that call themselves", steps: [
    { type: "learn", title: "Solve smaller versions", html: py`
      <p>A <b>recursive</b> function solves a problem by solving a smaller copy of it. It needs:</p>
      <ol><li>a <b>base case</b> that stops the recursion</li><li>a <b>recursive case</b> that moves toward the base case</li></ol>
      <pre data-run><code>def countdown(n):
    if n == 0:          # base case
        print("liftoff!")
        return
    print(n)
    countdown(n - 1)    # smaller problem</code></pre>
      <p>Each call sits on the <b>call stack</b>. Too deep and Python raises <code>RecursionError</code>.</p>` },
    { type: "quiz", q: "What happens if a recursive function has no base case?", options: ["RecursionError (stack overflow)", "It returns 0", "It returns None", "Python adds a base case"], answer: 0, why: [null, "Without a base case nothing ever returns. The calls just keep stacking up.", "Returning a value requires the function to finish, and this one never does.", "Python doesn't guess. Stopping is your job."], explain: "Calls pile up on the stack until Python gives up with RecursionError." },
    { type: "code", prompt: py`<p>Write <code>factorial(n)</code> recursively. <code>factorial(5)</code> = 5·4·3·2·1 = 120, and <code>factorial(0)</code> = 1.</p>`,
      starter: py`def factorial(n):
    pass
`, solution: py`def factorial(n):
    if n <= 1:
        return 1
    return n * factorial(n - 1)`, hint: "Base case n <= 1 returns 1. Otherwise n * factorial(n - 1).",
      tests: py`assert factorial(5) == 120
assert factorial(0) == 1
assert factorial(10) == 3628800` },
    { type: "code", prompt: py`<p>Write <code>sum_digits(n)</code> recursively: <code>sum_digits(1234)</code> is <code>10</code>. Use <code>n % 10</code> and <code>n // 10</code>.</p>`,
      starter: py`def sum_digits(n):
    pass
`, solution: py`def sum_digits(n):
    if n < 10:
        return n
    return n % 10 + sum_digits(n // 10)`, hint: "The last digit is n % 10. The rest is n // 10.",
      tests: py`assert sum_digits(1234) == 10
assert sum_digits(7) == 7
assert sum_digits(0) == 0
assert sum_digits(99999) == 45` },
    { type: "code", prompt: py`<p><b>Challenge:</b> write <code>power(base, exp)</code> recursively with <b>O(log n)</b> depth by squaring: <code>x^10 = (x^5)²</code>. The test uses <code>exp = 5000</code>, which would blow the stack if you multiply one at a time.</p>`,
      starter: py`def power(base, exp):
    pass
`, solution: py`def power(base, exp):
    if exp == 0:
        return 1
    half = power(base, exp // 2)
    if exp % 2 == 0:
        return half * half
    return half * half * base`, hint: "Compute half = power(base, exp // 2). Square it, and multiply by base once more if exp is odd.",
      tests: py`assert power(2, 10) == 1024
assert power(5, 0) == 1
assert power(3, 7) == 2187
assert power(3, 5000) == 3 ** 5000` },
    { type: "predict", code: py`def countdown(n):
    if n == 0:
        return 0
    print(n)
    return n + countdown(n - 1)

print(countdown(3))`,
      answer: py`3
2
1
6` },
  ]},
  { id: "graphs", needs: ["queues", "trees"], title: "Graphs & BFS", blurb: "Networks and shortest paths", steps: [
    { type: "learn", title: "Things and connections", html: py`
      <p>A <b>graph</b> is nodes connected by edges: maps, friendships, the web. In Python an <b>adjacency dict</b> is the easiest form:</p>
      <pre data-run><code>graph = {
    "A": ["B", "C"],
    "B": ["D"],
    "C": ["D"],
    "D": [],
}</code></pre>
      <p><b>Breadth-first search</b> explores neighbours level by level using a <b>queue</b>. In an unweighted graph the first time it reaches a node is via a shortest path.</p>
      <pre><code>queue = deque([start]); seen = {start}
while queue:
    node = queue.popleft()
    for nxt in graph[node]:
        if nxt not in seen:
            seen.add(nxt); queue.append(nxt)</code></pre>` },
    { type: "quiz", q: "Which data structure drives breadth-first search?", options: ["Queue", "Stack", "Heap", "Set only"], answer: 0, why: [null, "A stack gives depth-first search: it dives deep before exploring neighbours.", "Heaps hand out the smallest item first. That's for weighted searches, not level by level.", "A set tracks visited nodes but has no order, so it can't process nodes level by level."], explain: "A FIFO queue makes BFS finish one level before starting the next." },
    { type: "code", prompt: py`<p>Write <code>bfs_order(graph, start)</code> returning the nodes in the order BFS visits them (neighbours in listed order).</p>`,
      starter: py`from collections import deque

def bfs_order(graph, start):
    pass
`, solution: py`from collections import deque

def bfs_order(graph, start):
    order = []
    queue = deque([start])
    seen = {start}
    while queue:
        node = queue.popleft()
        order.append(node)
        for nxt in graph[node]:
            if nxt not in seen:
                seen.add(nxt)
                queue.append(nxt)
    return order`, hint: "Mark nodes as seen when you add them to the queue, not when you pop them.",
      tests: py`g = {"A": ["B", "C"], "B": ["D"], "C": ["D", "E"], "D": ["F"], "E": ["F"], "F": []}
assert bfs_order(g, "A") == ["A", "B", "C", "D", "E", "F"]
assert bfs_order({"x": []}, "x") == ["x"]
cyc = {1: [2], 2: [3], 3: [1]}
assert bfs_order(cyc, 1) == [1, 2, 3]` },
    { type: "code", prompt: py`<p>Write <code>shortest_path_length(graph, start, goal)</code>: the minimum number of edges from start to goal, or <code>-1</code> if unreachable.</p>`,
      starter: py`from collections import deque

def shortest_path_length(graph, start, goal):
    pass
`, solution: py`from collections import deque

def shortest_path_length(graph, start, goal):
    queue = deque([(start, 0)])
    seen = {start}
    while queue:
        node, dist = queue.popleft()
        if node == goal:
            return dist
        for nxt in graph[node]:
            if nxt not in seen:
                seen.add(nxt)
                queue.append((nxt, dist + 1))
    return -1`, hint: "Store (node, distance) pairs in the queue.",
      tests: py`g = {"A": ["B", "C"], "B": ["D"], "C": ["D"], "D": ["E"], "E": [], "Z": []}
assert shortest_path_length(g, "A", "E") == 3
assert shortest_path_length(g, "A", "A") == 0
assert shortest_path_length(g, "A", "Z") == -1
assert shortest_path_length(g, "B", "C") == -1` },
  ]},
  ]
},
{
  id: "eff", title: "Efficiency", desc: "Big-O, speed, memory and smart tricks", color: "navy",
  lessons: [
  { id: "bigo", needs: ["linear"], title: "Big-O Intuition", blurb: "How code scales", steps: [
    { type: "learn", title: "Growth rates", html: py`
      <p>Big-O describes how the work grows as the input size <i>n</i> grows, ignoring constants. Compare the common curves:</p>
      <div data-widget="bigo"></div>
      <table class="tbl"><tr><th>Class</th><th>Name</th><th>Example</th></tr>
      <tr><td>O(1)</td><td>constant</td><td>dict lookup, list[i]</td></tr>
      <tr><td>O(log n)</td><td>logarithmic</td><td>binary search</td></tr>
      <tr><td>O(n)</td><td>linear</td><td>scan a list</td></tr>
      <tr><td>O(n log n)</td><td>linearithmic</td><td>merge sort</td></tr>
      <tr><td>O(n²)</td><td>quadratic</td><td>nested loops</td></tr>
      <tr><td>O(2ⁿ)</td><td>exponential</td><td>naive fibonacci</td></tr></table>` },
    { type: "quiz", q: "Which operation is O(1) on average?", options: ["Looking up a key in a dict", "Searching an unsorted list", "Sorting a list", "Printing every item"], answer: 0, why: [null, "Searching an unsorted list may need to check every item: O(n).", "Sorting has to look at every item: O(n log n).", "Doing something for every item is O(n)."], explain: "Hashing jumps straight to the slot, no matter how large the dict is." },
    { type: "quiz", q: "Which of these grows the FASTEST as n gets large?", options: ["2ⁿ", "n²", "n log n", "n"], answer: 0, why: [null, "n² grows quickly, but doubling the work for every extra item (2ⁿ) overtakes it.", "n log n is only slightly above linear.", "n is the slowest-growing option in this list."], explain: "Exponential growth doubles with every extra item. Nothing else in the list comes close." },
    { type: "quiz", q: "What is the time complexity?", code: py`def total(items):
    s = 0
    for x in items:
        s += x
    return s`, options: ["O(n)", "O(1)", "O(n²)", "O(log n)"], answer: 0, why: [null, "The loop does O(1) work per item, but it runs once per item. Total work grows with size.", "There's only one loop here, not two nested ones.", "log n needs the problem to be halved each step. Here we visit every item."], explain: "One pass over n items." },
  ]},
  { id: "spot", needs: ["bigo"], title: "Spot the Complexity", blurb: "Read code, predict speed", steps: [
    { type: "learn", title: "Rules of thumb", html: py`
      <ul>
        <li><b>Sequential</b> steps add: O(n) + O(n) = O(n). Drop constants.</li>
        <li><b>Nested</b> loops multiply: n × n = O(n²).</li>
        <li><b>Halving</b> the problem each step gives O(log n).</li>
        <li>Keep the <b>dominant term</b>: O(n² + n) = O(n²).</li>
      </ul>
      <p>You can also measure! In the Playground, try <b>Run + Profile</b> to see real timings.</p>` },
    { type: "quiz", q: "What is the time complexity?", code: py`for a in items:
    for b in items:
        print(a, b)`, options: ["O(n²)", "O(n)", "O(2n)", "O(log n)"], answer: 0, why: [null, "The inner loop runs n times for EACH outer iteration, so the work multiplies.", "O(2n) would be two loops one after the other. These are nested, so they multiply.", "Nothing is being halved here, so it isn't logarithmic."], explain: "n iterations, each doing n more: n × n." },
    { type: "quiz", q: "What is the time complexity?", code: py`while n > 1:
    n //= 2`, options: ["O(log n)", "O(n)", "O(n²)", "O(1)"], answer: 0, why: [null, "n isn't reduced step by step. It's halved, which is much faster than counting down.", "There's no loop inside a loop, so it can't be quadratic.", "The loop runs more times as n grows, so it isn't constant."], explain: "n is halved each time, so it takes log₂ n steps to reach 1." },
    { type: "quiz", q: "What is the time complexity?", code: py`for x in items:
    print(x)
for x in items:
    print(x * 2)`, options: ["O(n)", "O(n²)", "O(2ⁿ)", "O(log n)"], answer: 0, why: [null, "The loops are sequential, not nested. Sequential work adds up, it doesn't multiply.", "Exponential needs branching recursion, not two plain loops.", "Each loop visits every item, so it can't be logarithmic."], explain: "Two separate passes: 2n, and constants are dropped." },
    { type: "code", prompt: py`<p>Write <code>has_duplicates(items)</code> returning <code>True</code> if any value appears twice. The test uses 200,000 items. A pair-by-pair O(n²) check will be far too slow. Use a set for O(n).</p>`,
      starter: py`def has_duplicates(items):
    pass
`, solution: py`def has_duplicates(items):
    seen = set()
    for x in items:
        if x in seen:
            return True
        seen.add(x)
    return False`, hint: "Keep a set of seen items. Checking membership in a set is O(1).",
      tests: py`assert has_duplicates([1, 2, 3, 1]) is True
assert has_duplicates([]) is False
assert has_duplicates(["a", "b"]) is False
big = list(range(200000))
r, t = timed(has_duplicates, big)
assert r is False
assert t < 0.5, f"Took {t:.2f}s. Aim for O(n)."
big.append(5)
assert has_duplicates(big) is True` },
  ]},
  { id: "twosum", needs: ["hashing", "spot"], title: "Trade Space for Time", blurb: "Use extra memory to go faster", steps: [
    { type: "learn", title: "Remember what you've seen", html: py`
      <p>Often you can turn O(n²) into O(n) by spending a little memory, usually a dict or set.</p>
      <p><b>Two Sum</b>: find two numbers adding to <code>target</code>. Brute force tries every pair: O(n²). Instead, for each number ask: <i>have I already seen <code>target - x</code>?</i></p>
      <pre><code>seen = {}                    # value -> index
for i, x in enumerate(nums):
    if target - x in seen:
        return seen[target - x], i
    seen[x] = i</code></pre>` },
    { type: "quiz", q: "What is the trade-off in the dict approach to Two Sum?", options: ["O(n) time but O(n) extra memory", "O(1) time and O(1) memory", "O(n²) time but no memory", "It can't find answers"], answer: 0, why: [null, "You still pass over all the numbers, and the dict grows with them.", "That's brute force. The dict removes the inner loop.", "It does find the pair. That's the whole point of the technique."], explain: "You spend memory (the dict) to avoid the inner loop." },
    { type: "code", prompt: py`<p>Write <code>two_sum(nums, target)</code> returning a tuple <code>(i, j)</code> with <code>i &lt; j</code> and <code>nums[i] + nums[j] == target</code>, or <code>None</code>. The test has 100,000 numbers.</p>`,
      starter: py`def two_sum(nums, target):
    pass
`, solution: py`def two_sum(nums, target):
    seen = {}
    for i, x in enumerate(nums):
        if target - x in seen:
            return (seen[target - x], i)
        seen[x] = i
    return None`, hint: "Look up target - x in a dict of earlier values.",
      tests: py`assert two_sum([2, 7, 11, 15], 9) == (0, 1)
assert two_sum([3, 2, 4], 6) == (1, 2)
assert two_sum([1, 2], 10) is None
nums = list(range(100000))
r, t = timed(two_sum, nums, 199997)
assert r == (99998, 99999), f"Got {r}"
assert t < 0.5, f"Took {t:.2f}s. Aim for O(n)."` },
    { type: "code", prompt: py`<p>Write <code>max_subarray(nums)</code>: the largest sum of any contiguous slice (Kadane's algorithm, O(n)). For <code>[-2,1,-3,4,-1,2,1,-5,4]</code> that's <code>6</code>.</p>`,
      starter: py`def max_subarray(nums):
    pass
`, solution: py`def max_subarray(nums):
    best = cur = nums[0]
    for x in nums[1:]:
        cur = max(x, cur + x)
        best = max(best, cur)
    return best`, hint: "At each item: either extend the current run (cur + x) or start fresh at x.",
      tests: py`assert max_subarray([-2, 1, -3, 4, -1, 2, 1, -5, 4]) == 6
assert max_subarray([5]) == 5
assert max_subarray([-3, -1, -2]) == -1
r, t = timed(max_subarray, [1] * 200000)
assert r == 200000
assert t < 0.5, f"Took {t:.2f}s. Aim for O(n)."` },
  ]},
  { id: "memo", needs: ["recursion", "bigo"], title: "Memoization", blurb: "Never solve the same thing twice", steps: [
    { type: "learn", title: "Cache your answers", html: py`
      <p>Naive recursive Fibonacci recomputes the same values again and again: <code>fib(40)</code> makes over 300 million calls!</p>
      <pre data-run><code>def fib(n):
    if n < 2: return n
    return fib(n - 1) + fib(n - 2)    # O(2ⁿ)

print(fib(5))</code></pre>
      <p><b>Memoization</b> stores results in a dict so each subproblem is solved once: O(n). Python can even do it for you with <code>functools.cache</code>.</p>
      <pre data-run><code>from functools import cache

@cache
def fib(n):
    return n if n < 2 else fib(n - 1) + fib(n - 2)

print(fib(30))</code></pre>` },
    { type: "quiz", q: "Roughly how many calls does naive recursive fib(40) make?", options: ["Over 300 million", "40", "About 800", "80"], answer: 0, why: [null, "40 calls would be one call per value, which is exactly what memoization gives you. Plain recursion does far more.", "The calls roughly double with each level, which grows much faster than 800.", "Without caching, the same fib values are recomputed again and again, so it's far more than 80."], explain: "The call tree nearly doubles at each level. That's why caching helps so much." },
    { type: "code", prompt: py`<p>Write <code>fib(n)</code> that is fast for large <code>n</code> (the test calls <code>fib(90)</code>). Use a dict cache or <code>functools.cache</code>.</p>`,
      starter: py`def fib(n):
    pass
`, solution: py`from functools import cache

@cache
def fib(n):
    if n < 2:
        return n
    return fib(n - 1) + fib(n - 2)`, hint: "Add @cache above a normal recursive fib, or keep your own dict.",
      tests: py`assert fib(0) == 0 and fib(1) == 1 and fib(10) == 55
r, t = timed(fib, 90)
assert r == 2880067194370816120
assert t < 0.5, "Too slow. Did you cache the results?"` },
    { type: "code", prompt: py`<p>A robot on a <code>rows × cols</code> grid moves only right or down. Write <code>count_paths(rows, cols)</code>: how many different paths lead from the top-left to the bottom-right? Without caching, <code>(18, 18)</code> takes forever.</p>`,
      starter: py`def count_paths(rows, cols):
    pass
`, solution: py`from functools import cache

def count_paths(rows, cols):
    @cache
    def go(r, c):
        if r == 1 or c == 1:
            return 1
        return go(r - 1, c) + go(r, c - 1)
    return go(rows, cols)`, hint: "paths(r, c) = paths(r-1, c) + paths(r, c-1). One row or column left means a single path.",
      tests: py`assert count_paths(1, 1) == 1
assert count_paths(2, 2) == 2
assert count_paths(3, 3) == 6
r, t = timed(count_paths, 18, 18)
assert r == 2333606220, f"Got {r}"
assert t < 0.5, "Too slow. Cache subproblems."` },
    { type: "predict", code: py`calls = 0

def fib(n):
    global calls
    calls += 1
    return n if n < 2 else fib(n - 1) + fib(n - 2)

print(fib(4), calls)`,
      answer: py`3 9` },
  ]},
  { id: "space", needs: ["memo", "spot"], title: "Memory & Generators", blurb: "Do more with less space", steps: [
    { type: "learn", title: "Space complexity", html: py`
      <p>Speed isn't the only cost. <b>Space complexity</b> measures extra memory. Two tools for saving it:</p>
      <ul>
        <li><b>In-place</b> algorithms modify the input instead of copying it: O(1) extra space.</li>
        <li><b>Generators</b> produce values one at a time with <code>yield</code> instead of building a whole list.</li>
      </ul>
      <pre data-run><code>def count_up(n):
    for i in range(n):
        yield i          # lazy: one value at a time

for n in count_up(3):
    print(n)

sum(x * x for x in range(10**7))   # no giant list in memory</code></pre>
      <p>Try the Playground's <b>Run + Profile</b> to see peak memory.</p>` },
    { type: "quiz", q: "Which uses O(1) extra memory?", options: ["sum(x * x for x in range(10**7))", "sum([x * x for x in range(10**7)])", "Both use O(1)", "Neither can run"], answer: 0, why: [null, "The square brackets build a list of ten million squares first.", "Only the generator avoids building that list.", "Both run. One just needs a lot of memory."], explain: "The generator yields one value at a time. The list comprehension builds all ten million first." },
    { type: "code", prompt: py`<p>Write <code>reverse_in_place(lst)</code> that reverses the list <b>in place</b> with two pointers (no slicing, no <code>reversed()</code>, no new list). Return <code>None</code>.</p>`,
      starter: py`def reverse_in_place(lst):
    pass
`, solution: py`def reverse_in_place(lst):
    i, j = 0, len(lst) - 1
    while i < j:
        lst[i], lst[j] = lst[j], lst[i]
        i += 1
        j -= 1`, hint: "Swap lst[i] and lst[j], then move i up and j down until they meet.",
      tests: py`assert "[::-1]" not in source and "reversed(" not in source and ".reverse(" not in source, "Do the swaps yourself"
a = [1, 2, 3, 4, 5]
ref = a
assert reverse_in_place(a) is None
assert a == [5, 4, 3, 2, 1] and a is ref
b = [1, 2]
reverse_in_place(b); assert b == [2, 1]
c = []
reverse_in_place(c); assert c == []` },
    { type: "code", prompt: py`<p>Write a <b>generator</b> <code>squares(n)</code> that yields <code>0, 1, 4, ...</code> up to (n-1)², one at a time.</p>`,
      starter: py`def squares(n):
    pass
`, solution: py`def squares(n):
    for i in range(n):
        yield i * i`, hint: "Use yield inside a for loop instead of return.",
      tests: py`import types
g = squares(5)
assert isinstance(g, types.GeneratorType), "squares should be a generator. Use yield."
assert next(g) == 0 and next(g) == 1
assert list(squares(5)) == [0, 1, 4, 9, 16]
assert list(squares(0)) == []
assert sum(squares(100000)) == 333328333350000` },
    { type: "predict", code: py`def squares(n):
    for i in range(n):
        yield i * i

gen = squares(3)
print(next(gen))
print(next(gen))
print(list(gen))`,
      answer: py`0
1
[4]` },
  ]},
  ]
},
{
  id: "project", title: "Build a Program", desc: "Put your skills together in one small project", color: "blue",
  lessons: [
  { id: "gradebook", needs: ["comprehensions", "sorting", "twosum"], title: "Project: Gradebook", blurb: "Build a small program from the pieces you know", steps: [
    { type: "learn", title: "Plan the program", html: py`
      <p>Real programs are small pieces that fit together. Today you build a <b>gradebook</b>: record scores for students, work out averages and print a ranking.</p>
      <p>The data is a <b>dict</b> mapping each name to a <b>list</b> of scores. Each piece is a <b>function</b>, and the last one reuses the others:</p>
      <pre data-run><code>book = {}
book.setdefault("Ada", []).append(90)
book.setdefault("Ada", []).append(100)
book.setdefault("Bo", []).append(70)
print(book)

averages = [(name, sum(s) / len(s)) for name, s in book.items()]
print(sorted(averages, key=lambda pair: pair[1], reverse=True))</code></pre>
      <p>Dicts (lookup), comprehensions (transform) and sorting (order) each did one job here. That is how you break a big task down.</p>` },
    { type: "code", prompt: py`<p><b>Piece 1.</b> Write <code>add_score(book, name, score)</code>. It appends <code>score</code> to the student's list (creating the list the first time) and changes <code>book</code> in place. Scores must be between 0 and 100, otherwise raise <code>ValueError</code>.</p>`,
      starter: py`def add_score(book, name, score):
    pass
`, solution: py`def add_score(book, name, score):
    if not 0 <= score <= 100:
        raise ValueError("score must be between 0 and 100")
    book.setdefault(name, []).append(score)`, hint: "setdefault(name, []) gives you the list, creating it if it is missing.",
      tests: py`b = {}
add_score(b, "Ada", 90)
add_score(b, "Ada", 100)
add_score(b, "Bo", 70)
assert b == {"Ada": [90, 100], "Bo": [70]}
for bad in (-1, 101):
    try:
        add_score(b, "Cy", bad)
    except ValueError:
        pass
    else:
        raise AssertionError(f"{bad} should raise ValueError")
assert "Cy" not in b, "A rejected score must not create the student"` },
    { type: "code", prompt: py`<p><b>Piece 2.</b> Write <code>average(book, name)</code> returning the student's average rounded to 1 decimal place. Return <code>None</code> if the student is unknown.</p>`,
      starter: py`def average(book, name):
    pass
`, solution: py`def average(book, name):
    scores = book.get(name)
    if not scores:
        return None
    return round(sum(scores) / len(scores), 1)`, hint: "book.get(name) returns None for a missing key instead of raising an error.",
      tests: py`b = {"Ada": [90, 100], "Bo": [70, 71, 72, 73]}
assert average(b, "Ada") == 95.0
assert average(b, "Bo") == 71.5
assert average(b, "Zed") is None
assert average({"Cy": [81, 82, 82]}, "Cy") == 81.7` },
    { type: "code", prompt: py`<p><b>Piece 3.</b> Write <code>ranking(book)</code> returning a list of <code>(name, average)</code> pairs, best average first. Break ties alphabetically by name. <code>average</code> is already written for you.</p>`,
      starter: py`def average(book, name):
    return round(sum(book[name]) / len(book[name]), 1)


def ranking(book):
    pass
`, solution: py`def average(book, name):
    return round(sum(book[name]) / len(book[name]), 1)


def ranking(book):
    pairs = [(name, average(book, name)) for name in book]
    return sorted(pairs, key=lambda p: (-p[1], p[0]))`, hint: "Sort with key=lambda p: (-p[1], p[0]): negative average first, then name.",
      tests: py`b = {"Bo": [70], "Ada": [90, 100], "Cy": [95], "Di": [70]}
assert ranking(b) == [("Ada", 95.0), ("Cy", 95.0), ("Bo", 70.0), ("Di", 70.0)]
assert ranking({}) == []
b["Bo"].append(0)
assert ranking(b)[-1] == ("Bo", 35.0)` },
    { type: "code", prompt: py`<p><b>Piece 4: put it together.</b> Write <code>report(book)</code> returning one string with a line per student, like <code>"1. Ada 95.0"</code>, best first, lines joined by <code>"\n"</code>. An empty gradebook gives <code>"No scores yet"</code>. <code>ranking</code> is already written.</p>`,
      starter: py`def ranking(book):
    pairs = [(name, round(sum(s) / len(s), 1)) for name, s in book.items()]
    return sorted(pairs, key=lambda p: (-p[1], p[0]))


def report(book):
    pass
`, solution: py`def ranking(book):
    pairs = [(name, round(sum(s) / len(s), 1)) for name, s in book.items()]
    return sorted(pairs, key=lambda p: (-p[1], p[0]))


def report(book):
    if not book:
        return "No scores yet"
    lines = [f"{i}. {name} {avg}" for i, (name, avg) in enumerate(ranking(book), start=1)]
    return "\n".join(lines)`, hint: "enumerate(items, start=1) numbers the lines from 1.",
      tests: py`assert report({}) == "No scores yet"
assert report({"Bo": [70], "Ada": [90, 100]}) == "1. Ada 95.0\n2. Bo 70.0"
assert report({"Di": [50], "Cy": [50], "Ev": [60]}) == "1. Ev 60.0\n2. Cy 50.0\n3. Di 50.0"` },
    { type: "predict", code: py`book = {}
for name, score in [("Ada", 90), ("Bo", 70), ("Ada", 100)]:
    book.setdefault(name, []).append(score)
print(book)
print(sum(book["Ada"]) / len(book["Ada"]))`,
      answer: py`{'Ada': [90, 100], 'Bo': [70]}
95.0` },
  ]},
  ]
},
];

window.EXAMPLES = [
  { name: "Hello, world", code: py`print("Hello, world!")

for i in range(3):
    print("Count:", i)
` },
  { name: "Fibonacci: slow vs fast", code: py`from functools import cache
import time


def fib_slow(n):
    return n if n < 2 else fib_slow(n - 1) + fib_slow(n - 2)


@cache
def fib_fast(n):
    return n if n < 2 else fib_fast(n - 1) + fib_fast(n - 2)

for name, fn in [("slow", fib_slow), ("fast", fib_fast)]:
    t = time.perf_counter()
    result = fn(27)
    print(f"{name}: fib(27) = {result} in {(time.perf_counter() - t) * 1000:.1f} ms")
` },
  { name: "Sorting race", code: py`import random
import time


def bubble_sort(a):
    a = list(a)
    for i in range(len(a)):
        for j in range(len(a) - 1 - i):
            if a[j] > a[j + 1]:
                a[j], a[j + 1] = a[j + 1], a[j]
    return a

data = [random.randint(0, 9999) for _ in range(1500)]
contenders = [("bubble sort O(n^2)", bubble_sort), ("built-in sorted", sorted)]

for name, fn in contenders:
    t = time.perf_counter()
    fn(data)
    print(f"{name:28} {(time.perf_counter() - t) * 1000:8.2f} ms")
` },
  { name: "Binary search", code: py`def binary_search(arr, target):
    lo, hi = 0, len(arr) - 1
    steps = 0
    while lo <= hi:
        steps += 1
        mid = (lo + hi) // 2
        if arr[mid] == target:
            return mid, steps
        if arr[mid] < target:
            lo = mid + 1
        else:
            hi = mid - 1
    return -1, steps

data = list(range(0, 2_000_000, 2))
print(binary_search(data, 1_234_568))
` },
  { name: "Classes: a stack", code: py`class Stack:
    def __init__(self):
        self._items = []

    def push(self, item):
        self._items.append(item)

    def pop(self):
        return self._items.pop()

    def __len__(self):
        return len(self._items)


s = Stack()
for ch in "python":
    s.push(ch)

print("".join(s.pop() for _ in range(len(s))))
` },
  { name: "Linter demo (messy code)", code: py`import os, sys
def Calculate(x,y):
    unused = 5
    if x == None:
        return y
    return x+z

list = [1,2,3]
def add_item(item, bucket=[]):
    bucket.append(item)
    return bucket
try:
    add_item(1)
except:
    pass
` },
];
