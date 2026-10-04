/* Curriculum. Step types: learn | quiz | code.
   Code steps are graded by running `tests` (Python) after the learner's code.
   Test helpers: output, run_with(**vars), timed(fn, *args), source. */
const py = String.raw;

window.UNITS = [
{
  id: "basics", title: "Python Basics", desc: "Variables, numbers, decisions and loops", color: "blue",
  lessons: [
  { id: "hello", rev: 2, needs: [], level: 1, title: "Hello, Python", blurb: "Print text and store values", steps: [
    { type: "predict", probe: true, ask: "Before we start: what do you think this prints?", code: py`print("Hello, Python")
print(2 + 3)`, answer: py`Hello, Python
5`, explain: "print() shows whatever is inside the brackets. Text in quotes is shown as it is; 2 + 3 has no quotes, so Python works it out first." },
    { type: "learn", title: "Your first program", html: py`
      <p>A program is a list of instructions that Python follows from top to bottom. The most famous first instruction is <code>print()</code>: it shows something on screen.</p>
      <pre data-try><code>print("Hello, world!")
print("Learning is fun")</code></pre>
      <p>Text goes inside quotes and is called a <b>string</b>. Numbers don't need quotes. <b>Your turn:</b> change the text above and press <i>Run</i>.</p>` },
    { type: "code", prompt: py`<p>Print exactly <code>Hello, world!</code></p>`,
      starter: py`# Write your code below
`, solution: py`print("Hello, world!")`, hint: ["You need the print() instruction.", "Put the text in quotes inside the brackets.", 'print("Hello, world!")'],
      tests: py`assert output.strip() == "Hello, world!", "Print exactly: Hello, world! (capital H, comma, exclamation mark)"` },
    { type: "learn", title: "Variables are labelled boxes", html: py`
      <p>A <b>variable</b> is a name that holds a value, like a box with a label. You make one with <code>=</code>, which means "put this value in that box":</p>
      <pre data-try><code>language = "Python"
year = 1991
print(language, year)</code></pre>
      <p>You can change what is in a box later, and use the name anywhere you would use the value. <b>Your turn:</b> make up a new variable and print it too.</p>` },
    { type: "fill", prompt: py`<p>Fill the blanks so the program prints <code>Ada 30</code>.</p>`,
      template: py`name = ___
age = 30
print(name, ___)
`, blanks: ['"Ada"', "age"], hint: ["Text needs quotes. A name for a variable doesn't.", 'The first blank is the text "Ada" (with quotes). The second is the variable that holds 30.'],
      tests: py`assert output.strip() == "Ada 30", "The program should print: Ada 30"`, explain: "Text goes in quotes, but a variable name stands on its own: Python looks up what is inside it." },
    { type: "order", prompt: py`<p>Put the lines in the right order so the program prints <code>31</code>. A line can only use a variable that already exists. The indentation is already set.</p>`,
      lines: ["age = 30", "next_year = age + 1", "print(next_year)"], distractors: [`print("next_year")`],
      hint: ["A variable has to be created before it is used.", "Start with age, then next_year, then print."],
      tests: py`assert output.strip() == "31", "The program should print 31"`, explain: "Python reads top to bottom, so a variable must be created before the line that uses it." },
    { type: "predict", code: py`a = 5
b = a
a = 8
print(a, b)`, answer: "8 5", explain: "b copied the value 5 at the moment of b = a. Changing a afterwards does not change b." },
    { type: "code", mode: "fix", prompt: py`<p>This program crashes. Read the error in the output, find the mistake and fix it so it prints <code>Hello, Ada</code>.</p>`,
      starter: py`name = "Ada"
print("Hello, " + nam)
`, solution: py`name = "Ada"
print("Hello, " + name)`, hint: ["Read the last line of the error: it names the problem.", "Python has never heard of nam. Look at how the variable was spelled when it was created."],
      tests: py`assert output.strip() == "Hello, Ada"`, explain: "A NameError almost always means a typo: the name you use must match the name you created." },
    { type: "code", boss: true, prompt: py`<p><b>Boss challenge, no hints.</b> <code>item</code> and <code>price</code> are already defined. Print a sentence like <code>pen costs 3 coins</code> built from them, so it works for any item and price.</p>`,
      starter: py`item = "pen"
price = 3
`, solution: py`item = "pen"
price = 3
print(item, "costs", price, "coins")`,
      tests: py`assert run_with(item="pen", price=3).out.strip() == "pen costs 3 coins"
assert run_with(item="cup", price=5).out.strip() == "cup costs 5 coins", "Use the variables, don't type the words pen or 3 yourself"`, explain: "You combined text and variables in one print: the skill every program uses." },
  ]},
  { id: "numbers", rev: 2, needs: ["hello"], level: 1, title: "Numbers & Strings", blurb: "Maths and f-strings", steps: [
    { type: "predict", probe: true, ask: "Warm-up: what do you think these three lines print?", code: py`print(7 / 2)
print(7 // 2)
print(7 % 2)`, answer: py`3.5
3
1`, explain: "/ is normal division. // drops the decimals (3.5 becomes 3). % gives the remainder left over (7 = 3 x 2 + 1)." },
    { type: "learn", title: "Python as a calculator", html: py`
      <p>Python understands the usual operators plus a few handy extras. Run this, then <b>change the numbers</b> and guess each answer before you press Run:</p>
      <pre data-try><code>print(7 + 2)     # addition
print(7 / 2)     # true division
print(7 // 2)    # floor division: drops the decimals
print(7 % 2)     # remainder
print(2 ** 10)   # power
print("ha" * 3)  # a string can be repeated too</code></pre>
      <p>The remainder <code>%</code> is surprisingly useful: <code>n % 2 == 0</code> is how you ask "is n even?".</p>` },
    { type: "fill", prompt: py`<p>How many minutes are in a week? Fill the blanks so it prints <code>10080</code> (7 days of 24 hours of 60 minutes).</p>`,
      template: py`minutes = 7 * ___ * ___
print(minutes)
`, blanks: ["24", "60"], hint: ["A day has 24 hours.", "An hour has 60 minutes."],
      tests: py`assert output.strip() == "10080", "7 days x 24 hours x 60 minutes = 10080"` },
    { type: "predict", code: py`a = 17
print(a // 5, a % 5)
print(a ** 2)`, answer: py`3 2
289`, explain: "17 is 3 whole fives plus 2 left over, so // gives 3 and % gives 2. a ** 2 is 17 x 17." },
    { type: "learn", title: "f-strings: values inside text", html: py`
      <p>An <b>f-string</b> puts values inside text. Start the string with <code>f</code> and wrap names or calculations in braces:</p>
      <pre data-try><code>name = "Ada"
age = 36
print(f"{name} is {age} years old")
print(f"In 10 years: {age + 10}")</code></pre>
      <p>Anything inside <code>{ }</code> is worked out first. <b>Your turn:</b> add a third line that uses <code>{age * 2}</code>.</p>` },
    { type: "order", prompt: py`<p>Put the lines in order so the program prints <code>Pay 18</code>. The shop gives a discount of a tenth of the price.</p>`,
      lines: ["price = 20", "discount = price // 10", "final = price - discount", `print(f"Pay {final}")`], distractors: [`print(f"Pay {price}")`],
      hint: ["Work out what each line needs before it can run.", "price first, then discount, then final, then print."],
      tests: py`assert output.strip() == "Pay 18"`, explain: "Each line builds on the one before: a program is a chain of small steps." },
    { type: "code", mode: "fix", prompt: py`<p>The shop wants to know how many <b>full</b> boxes of 5 cookies it can pack. This should print <code>3 full boxes</code> for 17 cookies, but it prints something else. Fix it.</p>`,
      starter: py`cookies = 17
boxes = cookies / 5
print(f"{boxes} full boxes")
`, solution: py`cookies = 17
boxes = cookies // 5
print(f"{boxes} full boxes")`, hint: ["Look at the output. What kind of number is it?", "Normal division gives a decimal. You want to drop the decimal part."],
      tests: py`assert output.strip() == "3 full boxes"
assert run_with(cookies=26).out.strip() == "5 full boxes", "It must work for other numbers of cookies too"`, explain: "// is the operator for 'how many whole ones fit'." },
    { type: "quiz", q: "What does this print?", code: `print("5" + "5")`, options: ["55", "10", "An error", "5 5"], answer: 0, why: [null, "10 would be 5 + 5 with numbers. The quotes make these text, and + joins text together.", "Joining two strings is allowed. Python only complains when you mix a string with a number.", "+ joins text with nothing in between. print(\"5\", \"5\") would add the space."], explain: "In quotes, 5 is text, not a number. + on text sticks the pieces together." },
    { type: "code", boss: true, prompt: py`<p><b>Boss challenge, no hints.</b> <code>width</code> and <code>height</code> are defined. Print the area as a sentence like <code>3 x 4 = 12</code> using an f-string, so it works for any values.</p>`,
      starter: py`width = 3
height = 4
`, solution: py`width = 3
height = 4
print(f"{width} x {height} = {width * height}")`,
      tests: py`assert run_with(width=3, height=4).out.strip() == "3 x 4 = 12"
assert run_with(width=10, height=7).out.strip() == "10 x 7 = 70", "Calculate inside the f-string, don't type the answer"` },
  ]},
  { id: "decisions", rev: 2, needs: ["numbers"], level: 1, title: "Decisions", blurb: "if, elif and else", steps: [
    { type: "predict", probe: true, ask: "Before we start: what do you think this prints?", code: py`temp = 22
if temp > 30:
    print("hot")
elif temp >= 15:
    print("nice")
else:
    print("cold")`, answer: "nice", explain: "Python checks the conditions from the top and runs only the first branch that is true. Here 22 is not above 30, but it is at least 15, so it prints nice and skips the rest." },
    { type: "learn", title: "Making choices", html: py`
      <p>Programs choose between paths with <code>if</code>. The indented lines (4 spaces) belong to the branch above them. Change <code>temp</code> and run it again to see each branch:</p>
      <pre data-try><code>temp = 22
if temp > 30:
    print("hot")
elif temp >= 15:
    print("nice")
else:
    print("cold")</code></pre>
      <p>Compare with <code>==  !=  &lt;  &gt;  &lt;=  &gt;=</code> (note <code>==</code> asks "equal?", while <code>=</code> stores a value). Combine tests with <code>and</code>, <code>or</code> and <code>not</code>.</p>` },
    { type: "order", prompt: py`<p>Build a grader for <code>score</code>: <code>A</code> for 90 and up, <code>B</code> for 80 and up, otherwise <code>C</code>. Indentation is set for you. One of the lines doesn't belong.</p>`,
      lines: ["score = 85", "if score >= 90:", `    print("A")`, "elif score >= 80:", `    print("B")`, "else:", `    print("C")`], distractors: ["if score >= 80:"],
      hint: ["An if block always starts with if, then elif branches, then else.", "Check the highest grade first."],
      tests: py`grade = lambda s: "A" if s >= 90 else "B" if s >= 80 else "C"
for s in (95, 90, 85, 80, 70):
    assert run_with(score=s).out.strip() == grade(s), f"Wrong grade for score = {s}"`, explain: "Only the first true branch runs, so the order of the checks matters: the strictest comes first." },
    { type: "fill", prompt: py`<p>Print <code>even</code> if <code>number</code> is even, otherwise <code>odd</code>.</p>`,
      template: py`number = 7
if number ___ 2 == 0:
    print("even")
___:
    print("odd")
`, blanks: ["%", "else"], hint: ["Even numbers leave no remainder when divided by 2.", "The remainder operator is %. The branch that catches everything else is else."],
      tests: py`for n in (7, 10, 0, -3):
    assert run_with(number=n).out.strip() == ("even" if n % 2 == 0 else "odd"), f"Wrong answer for number = {n}"` },
    { type: "predict", code: py`x = 10
if x > 5 and x < 8:
    print("A")
elif x >= 10:
    print("B")
else:
    print("C")`, answer: "B", explain: "x > 5 is true but x < 8 is false, and 'and' needs both sides true. So the first branch is skipped, and x >= 10 is true." },
    { type: "code", mode: "fix", prompt: py`<p>This should print exactly <b>one</b> grade: <code>A</code> for 90+, <code>B</code> for 80+, <code>C</code> for 70+, otherwise <code>F</code>. For 85 it prints two. Fix it.</p>`,
      starter: py`score = 85
if score >= 90:
    print("A")
if score >= 80:
    print("B")
if score >= 70:
    print("C")
`, solution: py`score = 85
if score >= 90:
    print("A")
elif score >= 80:
    print("B")
elif score >= 70:
    print("C")
else:
    print("F")`, hint: ["Run it and read the output: several branches ran.", "Separate ifs are all checked. You want only the first match to run."],
      tests: py`grade = lambda s: "A" if s >= 90 else "B" if s >= 80 else "C" if s >= 70 else "F"
for s in (95, 90, 85, 80, 72, 70, 40):
    assert run_with(score=s).out.strip() == grade(s), f"Wrong grade for score = {s}"`, explain: "elif means 'only if nothing above matched'. A row of plain ifs checks every one." },
    { type: "quiz", q: "Which condition checks that age is from 13 to 19, inclusive?", options: ["13 <= age <= 19", "age > 13 or age < 19", "age >= 13 and <= 19", "age = 13 and age = 19"], answer: 0, why: [null, "'or' is true when either side is: age 5 is below 19, so it would pass.", "Each side of 'and' needs its own full comparison: age >= 13 and age <= 19.", "A single = stores a value (and 'and' would need both to be true at once)."], explain: "Python lets you chain comparisons, so 13 <= age <= 19 reads like the maths." },
    { type: "code", prompt: py`<p>Print <code>positive</code>, <code>negative</code> or <code>zero</code> for the number in <code>n</code>.</p>`,
      starter: py`n = 5
`, solution: py`n = 5
if n > 0:
    print("positive")
elif n < 0:
    print("negative")
else:
    print("zero")`, hint: ["Three outcomes means if, elif and else.", "Test n > 0, then n < 0, and let else catch zero."],
      tests: py`for n, w in ((5, "positive"), (-2, "negative"), (0, "zero")):
    assert run_with(n=n).out.strip() == w, f"Wrong answer for n = {n}"` },
    { type: "code", boss: true, prompt: py`<p><b>Boss challenge, no hints.</b> Print <code>leap</code> or <code>not leap</code> for <code>year</code>. A leap year is divisible by 4, except years divisible by 100, unless they are also divisible by 400 (so 2000 is leap, 1900 is not).</p>`,
      starter: py`year = 2024
`, solution: py`year = 2024
if year % 400 == 0 or (year % 4 == 0 and year % 100 != 0):
    print("leap")
else:
    print("not leap")`,
      tests: py`for y, w in ((2024, "leap"), (1900, "not leap"), (2000, "leap"), (2023, "not leap"), (2100, "not leap"), (1996, "leap")):
    assert run_with(year=y).out.strip() == w, f"Wrong answer for {y}"` },
  ]},
  { id: "loops", rev: 2, needs: ["decisions"], level: 1, title: "Loops", blurb: "Repeat things with for and while", steps: [
    { type: "predict", probe: true, ask: "Before we start: what do you think this prints?", code: py`for i in range(3):
    print(i)`, answer: py`0
1
2`, explain: "A for loop runs its indented block once per value. range(3) counts 0, 1, 2: it starts at 0 and stops before 3." },
    { type: "learn", title: "Doing things again", html: py`
      <p>A <code>for</code> loop repeats a block for every item in a sequence. <code>range(n)</code> counts from 0 up to n-1. Try changing the numbers:</p>
      <pre data-try><code>for i in range(3):
    print("round", i)

for letter in "cat":
    print(letter)</code></pre>
      <p><code>range(start, stop, step)</code> gives you control: <code>range(2, 10, 3)</code> is 2, 5, 8. A <code>while</code> loop repeats as long as a condition is true, so something inside must eventually make it false:</p>
      <pre data-try><code>n = 1
while n < 100:
    n *= 2
print(n)</code></pre>` },
    { type: "fill", prompt: py`<p>Add up the numbers 1 to 5 and print <code>15</code>. Fill the blanks.</p>`,
      template: py`total = 0
for n in range(1, ___):
    total = total ___ n
print(total)
`, blanks: ["6", "+"], hint: ["range stops one before the end value.", "To include 5, the stop value must be 6. Each round, add n to the total."],
      tests: py`assert output.strip() == "15"`, explain: "range(1, 6) gives 1 to 5 because the stop value is never included." },
    { type: "order", prompt: py`<p>Build a countdown that prints <code>3</code>, <code>2</code>, <code>1</code> and then <code>Go!</code>. Indentation is set for you; one line is a trap.</p>`,
      lines: ["count = 3", "while count > 0:", "    print(count)", "    count = count - 1", `print("Go!")`], distractors: ["    count = count + 1"],
      hint: ["The variable must exist before the loop uses it.", "Inside the loop: print first, then change count. 'Go!' comes after the loop."],
      tests: py`assert output.split() == ["3", "2", "1", "Go!"]`, explain: "A while loop needs something inside that moves it toward ending. Here count shrinks until count > 0 is false." },
    { type: "predict", code: py`total = 0
for n in range(1, 4):
    total += n
    print(total)`, answer: py`1
3
6`, explain: "total grows by n every round: 0+1=1, 1+2=3, 3+3=6. print sits inside the loop, so it shows every step." },
    { type: "code", mode: "fix", prompt: py`<p>This should add the numbers from <code>1</code> up to <code>n</code> <b>including</b> n (so <code>15</code> when n is 5), but it prints <code>10</code>. Fix it.</p>`,
      starter: py`n = 5
total = 0
for i in range(1, n):
    total += i
print(total)
`, solution: py`n = 5
total = 0
for i in range(1, n + 1):
    total += i
print(total)`, hint: ["Count which numbers the loop actually visits.", "range(1, n) stops before n. How do you make it include n?"],
      tests: py`for n, want in [(5, 15), (10, 55), (1, 1), (0, 0)]:
    assert run_with(n=n).out.strip() == str(want), f"With n = {n} it should print {want}"`, explain: "Off-by-one errors are the most common loop bug. The stop value of range is never included." },
    { type: "quiz", q: "How many times does this loop run its block?", code: "for i in range(2, 10, 3):", options: ["3 times (2, 5, 8)", "4 times (2, 5, 8, 10)", "8 times", "10 times"], answer: 0, why: [null, "range never includes the stop value, so 10 can't appear.", "8 would be 10 - 2 with a step of 1. The third number is the step size: it jumps by 3.", "That is the stop value, not the number of rounds."], explain: "It visits 2, 5 and 8, then the next value (11) is past the stop." },
    { type: "code", prompt: py`<p>Count how many times the letter <code>a</code> appears in <code>word</code> and store the count in <code>count</code>.</p>`,
      starter: py`word = "banana"
count = 0
`, solution: py`word = "banana"
count = 0
for letter in word:
    if letter == "a":
        count += 1`, hint: ["A for loop can walk through the letters of a string.", "Inside the loop, an if decides whether this letter is an a.", "if letter == \"a\": count += 1"],
      tests: py`for w, want in (("banana", 3), ("sky", 0), ("aaa", 3), ("", 0)):
    assert run_with(word=w).vars["count"] == want, f"{w!r} has {want} letter a"` },
    { type: "code", boss: true, prompt: py`<p><b>Boss challenge, no hints.</b> Print a triangle of stars with <code>n</code> rows: row 1 has one star, row 2 has two, and so on. For <code>n = 3</code> it prints three lines: <code>*</code>, <code>**</code>, <code>***</code>. Remember that <code>"*" * 3</code> repeats text.</p>`,
      starter: py`n = 4
`, solution: py`n = 4
for row in range(1, n + 1):
    print("*" * row)`,
      tests: py`for n in (1, 3, 5):
    assert run_with(n=n).out.split() == ["*" * k for k in range(1, n + 1)], f"Wrong triangle for n = {n}"` },
  ]},
  { id: "tipcalc", kind: "project", needs: ["numbers", "decisions"], level: 1, title: "Mini: Tip Calculator", blurb: "Split a restaurant bill with numbers and rounding", steps: [
    { type: "learn", title: "The plan", html: py`
      <p>Time for a tiny real program. You are building the maths behind a <b>tip calculator</b>: add a tip, split the bill between friends, and print a neat receipt.</p>
      <p>Money needs <code>round(x, 2)</code> so you never show <code>12.300000000000001</code>:</p>
      <pre data-try><code>bill = 48.5
tip = bill * 0.18
print(tip)
print(round(tip, 2))
print(f"Total: {round(bill + tip, 2):.2f}")</code></pre>
      <p>You will write three small functions, each using the one before.</p>` },
    { type: "code", prompt: py`<p><b>Piece 1.</b> Write <code>tip(bill, percent)</code> returning the tip amount rounded to 2 decimals. <code>tip(50, 20)</code> is <code>10.0</code>.</p>`,
      starter: py`def tip(bill, percent):
    pass
`, solution: py`def tip(bill, percent):
    return round(bill * percent / 100, 2)`, hint: "bill * percent / 100, then round(..., 2).",
      tests: py`assert tip(50, 20) == 10.0
assert tip(48.5, 18) == 8.73, "48.5 * 18% is 8.73 when rounded"
assert tip(0, 15) == 0` },
    { type: "code", prompt: py`<p><b>Piece 2.</b> Write <code>split_bill(bill, percent, people)</code> returning what <i>each person</i> pays (bill plus tip, divided by people), rounded to 2 decimals. Reuse <code>tip</code>. If <code>people</code> is less than 1, raise <code>ValueError</code>.</p>`,
      starter: py`def tip(bill, percent):
    return round(bill * percent / 100, 2)

def split_bill(bill, percent, people):
    pass
`, solution: py`def tip(bill, percent):
    return round(bill * percent / 100, 2)

def split_bill(bill, percent, people):
    if people < 1:
        raise ValueError("need at least one person")
    return round((bill + tip(bill, percent)) / people, 2)`, hint: "(bill + tip(bill, percent)) / people. Check people first.",
      tests: py`assert split_bill(100, 20, 4) == 30.0
assert split_bill(48.5, 18, 2) == 28.62
try:
    split_bill(10, 10, 0)
except ValueError:
    pass
else:
    raise AssertionError("0 people should raise ValueError")` },
    { type: "code", prompt: py`<p><b>Piece 3.</b> Write <code>receipt(bill, percent, people)</code> returning a 3-line string joined by <code>"\n"</code>:<br><code>Bill: 100.00</code><br><code>Tip (20%): 20.00</code><br><code>Each pays: 30.00</code><br>(for <code>receipt(100, 20, 4)</code>). Every amount shows exactly 2 decimals.</p>`,
      starter: py`def tip(bill, percent):
    return round(bill * percent / 100, 2)

def split_bill(bill, percent, people):
    return round((bill + tip(bill, percent)) / people, 2)

def receipt(bill, percent, people):
    pass
`, solution: py`def tip(bill, percent):
    return round(bill * percent / 100, 2)

def split_bill(bill, percent, people):
    return round((bill + tip(bill, percent)) / people, 2)

def receipt(bill, percent, people):
    lines = [
        f"Bill: {bill:.2f}",
        f"Tip ({percent}%): {tip(bill, percent):.2f}",
        f"Each pays: {split_bill(bill, percent, people):.2f}",
    ]
    return "\n".join(lines)`, hint: "f\"{value:.2f}\" always shows two decimals. Join the three f-strings with \"\\n\".",
      tests: py`assert receipt(100, 20, 4) == "Bill: 100.00\nTip (20%): 20.00\nEach pays: 30.00"
assert receipt(48.5, 18, 2).splitlines()[2] == "Each pays: 28.62"` },
    { type: "quiz", q: "Why is it good that receipt() calls tip() and split_bill() instead of repeating their maths?", options: ["Python forbids repeating code", "A rule changes in one place and every caller gets it", "It makes the program run faster", "Functions cannot be longer than 3 lines"], answer: 1, why: ["Python allows it, it is just a bad habit.", null, "Speed is about the same. The benefit is maintainability.", "There is no such rule."], explain: "One source of truth: change how tips are calculated once and the receipt follows automatically." },
  ]},
  { id: "fizz", kind: "project", needs: ["loops"], level: 1, title: "Mini: FizzBuzz", blurb: "The classic loop-and-decision warm-up", steps: [
    { type: "learn", title: "The classic", html: py`
      <p><b>FizzBuzz</b> is the most famous beginner exercise. Count from 1 to n, but swap some numbers for words:</p>
      <ul><li>multiples of 3 become <code>Fizz</code></li><li>multiples of 5 become <code>Buzz</code></li><li>multiples of both become <code>FizzBuzz</code></li></ul>
      <p>The tool for "is it a multiple?" is the remainder operator: <code>n % 3 == 0</code>.</p>
      <pre data-try><code>for n in range(1, 8):
    if n % 3 == 0:
        print(n, "is a multiple of 3")
    else:
        print(n)</code></pre>` },
    { type: "code", prompt: py`<p><b>Piece 1.</b> Write <code>fizzbuzz_word(n)</code> returning <code>"Fizz"</code>, <code>"Buzz"</code>, <code>"FizzBuzz"</code> or the number as a string.</p>`,
      starter: py`def fizzbuzz_word(n):
    pass
`, solution: py`def fizzbuzz_word(n):
    if n % 15 == 0:
        return "FizzBuzz"
    if n % 3 == 0:
        return "Fizz"
    if n % 5 == 0:
        return "Buzz"
    return str(n)`, hint: "Check the 'both' case (multiple of 15) first, or the Fizz branch will catch it.",
      tests: py`assert [fizzbuzz_word(n) for n in (1, 3, 5, 15, 7, 30)] == ["1", "Fizz", "Buzz", "FizzBuzz", "7", "FizzBuzz"]` },
    { type: "code", prompt: py`<p><b>Piece 2.</b> Write <code>fizzbuzz(n)</code> returning the list of words for 1..n. <code>fizzbuzz(5)</code> is <code>["1", "2", "Fizz", "4", "Buzz"]</code>.</p>`,
      starter: py`def fizzbuzz_word(n):
    if n % 15 == 0:
        return "FizzBuzz"
    if n % 3 == 0:
        return "Fizz"
    if n % 5 == 0:
        return "Buzz"
    return str(n)

def fizzbuzz(n):
    pass
`, solution: py`def fizzbuzz_word(n):
    if n % 15 == 0:
        return "FizzBuzz"
    if n % 3 == 0:
        return "Fizz"
    if n % 5 == 0:
        return "Buzz"
    return str(n)

def fizzbuzz(n):
    return [fizzbuzz_word(i) for i in range(1, n + 1)]`, hint: "range(1, n + 1) includes n.",
      tests: py`assert fizzbuzz(5) == ["1", "2", "Fizz", "4", "Buzz"]
assert fizzbuzz(15)[-1] == "FizzBuzz"
assert fizzbuzz(0) == []` },
    { type: "code", prompt: py`<p><b>Piece 3: your own rule.</b> Write <code>count_words(n)</code> returning a dict with how many times each word appears in <code>fizzbuzz(n)</code>, counting every plain number as <code>"number"</code>. <code>count_words(15)</code> is <code>{"number": 8, "Fizz": 4, "Buzz": 2, "FizzBuzz": 1}</code>.</p>`,
      starter: py`def fizzbuzz_word(n):
    if n % 15 == 0:
        return "FizzBuzz"
    if n % 3 == 0:
        return "Fizz"
    if n % 5 == 0:
        return "Buzz"
    return str(n)

def count_words(n):
    pass
`, solution: py`def fizzbuzz_word(n):
    if n % 15 == 0:
        return "FizzBuzz"
    if n % 3 == 0:
        return "Fizz"
    if n % 5 == 0:
        return "Buzz"
    return str(n)

def count_words(n):
    counts = {}
    for i in range(1, n + 1):
        word = fizzbuzz_word(i)
        if word.isdigit():
            word = "number"
        counts[word] = counts.get(word, 0) + 1
    return counts`, hint: "word.isdigit() tells you it is a plain number. counts.get(word, 0) + 1 counts it.",
      tests: py`assert count_words(15) == {"number": 8, "Fizz": 4, "Buzz": 2, "FizzBuzz": 1}
assert count_words(2) == {"number": 2}` },
  ]},
  { id: "guess", kind: "project", needs: ["decisions", "loops"], level: 1, title: "Mini: Number Guesser", blurb: "The logic of a guessing game, with a computer that plays it", steps: [
    { type: "learn", title: "Game logic first", html: py`
      <p>A guessing game picks a secret number and tells you <i>higher</i> or <i>lower</i>. We cannot type into the browser lesson, so you will write the <b>logic</b> and then let the computer play against it.</p>
      <p>The smartest strategy is to always guess the middle of what is left. It finds any number from 1 to 100 in at most 7 guesses. You will meet this idea again as <b>binary search</b>.</p>
      <pre data-try><code>low, high = 1, 100
secret = 37
while True:
    guess = (low + high) // 2
    print("guess", guess)
    if guess == secret:
        break
    if guess < secret:
        low = guess + 1
    else:
        high = guess - 1</code></pre>` },
    { type: "code", prompt: py`<p><b>Piece 1.</b> Write <code>judge(secret, guess)</code> returning <code>"low"</code> if the guess is below the secret, <code>"high"</code> if above, <code>"correct"</code> if equal.</p>`,
      starter: py`def judge(secret, guess):
    pass
`, solution: py`def judge(secret, guess):
    if guess < secret:
        return "low"
    if guess > secret:
        return "high"
    return "correct"`, hint: "Three outcomes: compare with < and >, otherwise they must be equal.",
      tests: py`assert judge(50, 10) == "low" and judge(50, 90) == "high" and judge(50, 50) == "correct"` },
    { type: "code", prompt: py`<p><b>Piece 2.</b> Write <code>play(secret, low=1, high=100)</code> where the computer always guesses the middle <code>(low + high) // 2</code>, adjusting its range from <code>judge</code>'s answer. Return the number of guesses it took.</p>`,
      starter: py`def judge(secret, guess):
    if guess < secret:
        return "low"
    if guess > secret:
        return "high"
    return "correct"

def play(secret, low=1, high=100):
    pass
`, solution: py`def judge(secret, guess):
    if guess < secret:
        return "low"
    if guess > secret:
        return "high"
    return "correct"

def play(secret, low=1, high=100):
    tries = 0
    while True:
        guess = (low + high) // 2
        tries += 1
        verdict = judge(secret, guess)
        if verdict == "correct":
            return tries
        if verdict == "low":
            low = guess + 1
        else:
            high = guess - 1`, hint: "Loop forever, count each guess, and return when the verdict is 'correct'. 'low' means raise low.",
      tests: py`assert play(50) == 1, "50 is the very first guess"
assert play(37) == 3
assert all(play(n) <= 7 for n in range(1, 101)), "never more than 7 guesses for 1..100"` },
    { type: "code", prompt: py`<p><b>Piece 3: the worst case.</b> Write <code>hardest(low, high)</code> returning the secret number in that range that takes the computer the most guesses (the smallest one if tied). Use your <code>play</code>.</p>`,
      starter: py`def judge(secret, guess):
    if guess < secret:
        return "low"
    if guess > secret:
        return "high"
    return "correct"

def play(secret, low=1, high=100):
    tries = 0
    while True:
        guess = (low + high) // 2
        tries += 1
        verdict = judge(secret, guess)
        if verdict == "correct":
            return tries
        if verdict == "low":
            low = guess + 1
        else:
            high = guess - 1

def hardest(low, high):
    pass
`, solution: py`def judge(secret, guess):
    if guess < secret:
        return "low"
    if guess > secret:
        return "high"
    return "correct"

def play(secret, low=1, high=100):
    tries = 0
    while True:
        guess = (low + high) // 2
        tries += 1
        verdict = judge(secret, guess)
        if verdict == "correct":
            return tries
        if verdict == "low":
            low = guess + 1
        else:
            high = guess - 1

def hardest(low, high):
    best, best_tries = low, 0
    for n in range(low, high + 1):
        tries = play(n, low, high)
        if tries > best_tries:
            best, best_tries = n, tries
    return best`, hint: "Try every secret, remember the largest tries (use > so ties keep the smallest).",
      tests: py`h = hardest(1, 100)
assert play(h) == 7
assert h == 2, "the smallest number needing 7 guesses is 2"
assert hardest(1, 1) == 1` },
  ]},
  ]
},
{
  id: "funcs", title: "Functions & Collections", desc: "Reusable code, lists, dicts and sets", color: "yellow",
  lessons: [
  { id: "functions", rev: 2, needs: ["loops"], level: 2, title: "Functions", blurb: "Package code for reuse", steps: [
    { type: "predict", probe: true, ask: "Before we start: what do you think this prints?", code: py`def add(a, b):
    return a + b

print(add(2, 3) * 2)`, answer: "10", explain: "Calling a function is replaced by the value it returns: add(2, 3) becomes 5, and then 5 * 2 is 10." },
    { type: "learn", title: "Define once, use often", html: py`
      <p>A function is a named, reusable block of code. It takes <b>parameters</b> (the inputs in the brackets) and sends a value back with <code>return</code>. Call it as many times as you like:</p>
      <pre data-try><code>def area(width, height=1):
    return width * height

print(area(3, 4))
print(area(5))</code></pre>
      <p><code>height=1</code> is a <b>default</b>: if you don't pass a value, Python uses it. <b>Your turn:</b> call <code>area</code> with different numbers.</p>
      <p>Careful: <code>print</code> <i>shows</i> a value on screen, while <code>return</code> <i>hands it back</i> to whoever called the function. A function without <code>return</code> hands back <code>None</code>.</p>` },
    { type: "fill", prompt: py`<p>Complete the function so that <code>area(3, 4)</code> gives back <code>12</code>.</p>`,
      template: py`def ___(width, height):
    ___ width * height

print(area(3, 4))
`, blanks: ["area", "return"], hint: ["The call at the bottom tells you the function's name.", "A function has to hand its result back with return."],
      tests: py`assert area(3, 4) == 12 and area(0, 5) == 0 and area(2, 2) == 4
assert output.strip() == "12"`, explain: "def names the function, and return sends the answer back to the caller." },
    { type: "order", prompt: py`<p>Build <code>clamp(value, low, high)</code>: it returns <code>low</code> if the value is too small, <code>high</code> if too big, otherwise the value itself. One line does not belong.</p>`,
      lines: ["def clamp(value, low, high):", "    if value < low:", "        return low", "    if value > high:", "        return high", "    return value"], distractors: ["return high"],
      hint: ["The def line comes first. Each if is followed by its own return.", "The plain 'return value' goes last: it handles everything the ifs let through."],
      tests: py`assert clamp(5, 0, 10) == 5 and clamp(-5, 0, 10) == 0 and clamp(50, 0, 10) == 10 and clamp(10, 0, 10) == 10`,
      explain: "return ends the function immediately, so the final return only runs when neither if matched." },
    { type: "predict", code: py`def shout(word, times=2):
    return (word + "!") * times

print(shout("hi"))
print(shout("ok", 1))`, answer: py`hi!hi!
ok!`, explain: "The first call uses the default times=2. The second passes 1, which replaces the default." },
    { type: "code", mode: "fix", prompt: py`<p><code>double(4)</code> should print <code>8</code>, but it prints something else. Fix the function.</p>`,
      starter: py`def double(x):
    x * 2

print(double(4))
`, solution: py`def double(x):
    return x * 2

print(double(4))`, hint: ["Look at what is printed. Is the function giving anything back?", "x * 2 is calculated and then thrown away. Hand it back with return."],
      tests: py`assert output.strip() == "8"
assert double(5) == 10 and double(0) == 0`, explain: "Without return a function gives back None, however much it calculated inside." },
    { type: "quiz", q: "What happens when this code runs?", code: py`def add(a, b):
    print(a + b)

total = add(2, 3) + 10`, options: ["It prints 5, then crashes with a TypeError", "total becomes 15", "It prints 15", "Nothing happens"], answer: 0, why: [null, "add prints 5 but returns None, so the line becomes None + 10.", "Nothing prints 15. The 10 is never added to the 5, it meets None.", "The function does run, so 5 is printed first."], explain: "print only shows a value. To use a result in more maths you need return." },
    { type: "code", prompt: py`<p>Write <code>greet(name, greeting="Hello")</code> that returns text like <code>Hello, Ada!</code>. Passing a second argument changes the greeting.</p>`,
      starter: py`def greet(name, greeting="Hello"):
    pass
`, solution: py`def greet(name, greeting="Hello"):
    return f"{greeting}, {name}!"`, hint: ["Build a string with an f-string.", "Use both parameters inside the braces.", 'return f"{greeting}, {name}!"'],
      tests: py`assert greet("Ada") == "Hello, Ada!"
assert greet("Ada", "Hi") == "Hi, Ada!"`, explain: "Parameters with defaults make a function flexible without making it harder to call." },
    { type: "code", boss: true, prompt: py`<p><b>Boss challenge, no hints.</b> Write <code>middle(a, b, c)</code> returning the middle value of three numbers (the one that is neither the smallest nor the largest). <code>middle(3, 9, 5)</code> is <code>5</code>.</p>`,
      starter: py`def middle(a, b, c):
    pass
`, solution: py`def middle(a, b, c):
    return a + b + c - min(a, b, c) - max(a, b, c)`,
      tests: py`from itertools import permutations
for p in permutations((3, 9, 5)):
    assert middle(*p) == 5, f"middle{p} should be 5"
assert middle(1, 1, 2) == 1 and middle(-4, 0, -9) == -4 and middle(7, 7, 7) == 7` },
  ]},
  { id: "lists", rev: 2, needs: ["loops"], level: 2, title: "Lists", blurb: "Ordered collections", steps: [
    { type: "predict", probe: true, ask: "Before we start: what do you think this prints?", code: py`nums = [10, 20, 30, 40]
print(nums[0], nums[-1])
print(nums[1:3])`, answer: py`10 40
[20, 30]`, explain: "Positions start at 0, so nums[0] is the first item. A negative index counts from the end. A slice [1:3] takes positions 1 and 2: the stop position is never included." },
    { type: "learn", title: "Lists hold many values", html: py`
      <p>A <b>list</b> keeps many values in order. Each has a position (an <i>index</i>) starting at 0. Poke at it, then change the numbers:</p>
      <pre data-try><code>nums = [10, 20, 30, 40]
print(nums[0])       # first
print(nums[-1])      # last
print(nums[1:3])     # slice: stop excluded
nums.append(50)
print(len(nums), nums)

for n in nums:
    print(n * 2)</code></pre>
      <p>Lists are <b>mutable</b>: you can change them in place, and getting an item by position is instant.</p>` },
    { type: "fill", prompt: py`<p>Add <code>"plum"</code> to the list, then print the <b>last</b> item so the program prints <code>plum</code>.</p>`,
      template: py`fruits = ["apple", "pear"]
fruits.___("plum")
print(fruits[___])
`, blanks: ["append", "-1"], hint: ["append adds an item to the end of a list.", "A negative index counts from the end. Which one is the very last?"],
      tests: py`assert output.strip() == "plum"`, explain: "[-1] is the last item no matter how long the list is." },
    { type: "order", prompt: py`<p>Build <code>evens(nums)</code>, which returns a new list with only the even numbers. One line is a trap.</p>`,
      lines: ["def evens(nums):", "    result = []", "    for n in nums:", "        if n % 2 == 0:", "            result.append(n)", "    return result"], distractors: ["        return result"],
      hint: ["Make the empty list before the loop, return it after the loop.", "The append goes inside the if, which is inside the for."],
      tests: py`assert evens([1, 2, 3, 4, 5, 6]) == [2, 4, 6] and evens([1, 3]) == [] and evens([]) == [] and evens([-2, 7, 0]) == [-2, 0]`,
      explain: "The classic pattern: start empty, loop, add what matches, return at the end." },
    { type: "predict", code: py`a = [1, 2, 3]
b = a
b.append(4)
print(a)
print(len(b))`, answer: py`[1, 2, 3, 4]
4`, explain: "b = a doesn't copy the list, it gives the same list a second name. Changing it through b changes it for a too." },
    { type: "code", mode: "fix", prompt: py`<p>This should print <code>[1, 2, 3, 4]</code> but prints something else. Fix it.</p>`,
      starter: py`nums = [1, 2, 3]
nums = nums.append(4)
print(nums)
`, solution: py`nums = [1, 2, 3]
nums.append(4)
print(nums)`, hint: ["Look at what nums holds after the second line.", "append changes the list in place and returns None. Don't assign its result."],
      tests: py`assert output.strip() == "[1, 2, 3, 4]"`, explain: "Methods that change a list in place (append, sort, reverse) return None, so never write x = x.append(...)." },
    { type: "quiz", q: "What does this print?", code: py`a = [1, 2, 3]
b = a[:]
b.append(4)
print(len(a))`, options: ["3", "4", "2", "It crashes"], answer: 0, why: [null, "That would be true for b = a, which shares one list. a[:] makes a copy.", "The list a was never shortened.", "Slicing with [:] is valid and gives a full copy."], explain: "A slice builds a new list, so b is independent and a stays untouched." },
    { type: "code", prompt: py`<p>Write <code>rotate_left(lst)</code> returning a new list where the first item moved to the end. <code>[1, 2, 3]</code> becomes <code>[2, 3, 1]</code>. An empty list stays empty and the original must not change.</p>`,
      starter: py`def rotate_left(lst):
    pass
`, solution: py`def rotate_left(lst):
    return lst[1:] + lst[:1]`, hint: ["Slices build new lists, and lists can be joined with +.", "lst[1:] is everything except the first. lst[:1] is just the first.", "return lst[1:] + lst[:1]"],
      tests: py`a = [1, 2, 3]
assert rotate_left(a) == [2, 3, 1]
assert a == [1, 2, 3], "Don't change the original list"
assert rotate_left([]) == []
assert rotate_left([9]) == [9]` },
    { type: "code", boss: true, prompt: py`<p><b>Boss challenge, no hints.</b> Write <code>second_largest(nums)</code> returning the second largest number in a list of at least two numbers. Duplicates count separately: in <code>[5, 5, 3]</code> the second largest is <code>5</code>.</p>`,
      starter: py`def second_largest(nums):
    pass
`, solution: py`def second_largest(nums):
    return sorted(nums)[-2]`,
      tests: py`assert second_largest([1, 9, 4]) == 4 and second_largest([5, 5, 3]) == 5 and second_largest([2, 2]) == 2
a = [3, 8, 1]
second_largest(a)
assert a == [3, 8, 1], "Don't reorder the caller's list"
assert second_largest([-5, -1, -3]) == -3` },
  ]},
  { id: "dicts", rev: 2, needs: ["lists"], level: 2, title: "Dicts & Sets", blurb: "Look things up by key", steps: [
    { type: "predict", probe: true, ask: "Before we start: what do you think this prints?", code: py`ages = {"Ada": 36, "Linus": 54}
print(ages["Ada"])
print(ages.get("Bob", 0))`, answer: py`36
0`, explain: "A dict looks values up by key instead of by position. get() is the safe way: it returns your default (0) instead of crashing when the key is missing." },
    { type: "learn", title: "Key → value", html: py`
      <p>A <b>dict</b> maps keys to values, like a phone book maps names to numbers. Looking up a key is very fast, however big the dict is. Change things and run it again:</p>
      <pre data-try><code>ages = {"Ada": 36, "Linus": 54}
print(ages["Ada"])
ages["Grace"] = 45          # add or change
print(ages.get("Bob", 0))   # default if missing
for name, age in ages.items():
    print(name, age)</code></pre>
      <p>A <b>set</b> keeps only unique values and is just as fast at "is it in here?":</p>
      <pre data-try><code>seen = set([1, 1, 2, 3, 3])
print(seen, len(seen))
print(2 in seen, 7 in seen)</code></pre>` },
    { type: "fill", prompt: py`<p>Add a new price for <code>"coffee"</code>, then print the total price of coffee plus tea (<code>8</code>).</p>`,
      template: py`prices = {"tea": 3, "milk": 2}
prices[___] = 5
print(prices["coffee"] + prices[___])
`, blanks: ['"coffee"', '"tea"'], hint: ["Assigning to a new key adds it.", "The key you add is the one the print line reads. The second blank is the other drink in the sum 8."],
      tests: py`assert output.strip() == "8"`, explain: "dict[key] = value creates the entry if the key is new, or replaces it if it exists." },
    { type: "order", prompt: py`<p>Build <code>word_count(text)</code>, which returns how often each word appears (ignoring case). One line is a trap.</p>`,
      lines: ["def word_count(text):", "    counts = {}", "    for word in text.lower().split():", "        counts[word] = counts.get(word, 0) + 1", "    return counts"], distractors: ["        counts[word] = counts[word] + 1"],
      hint: ["Set up the empty dict first, return it last.", "The counting line goes inside the for loop."],
      tests: py`assert word_count("a B a") == {"a": 2, "b": 1} and word_count("The the THE") == {"the": 3} and word_count("") == {}`,
      explain: "counts.get(word, 0) + 1 handles the first time a word is seen without crashing." },
    { type: "predict", code: py`stock = {"apples": 3}
stock["pears"] = stock.get("pears", 0) + 2
stock["apples"] += 1
print(stock)`, answer: "{'apples': 4, 'pears': 2}", explain: "pears didn't exist, so get gave 0 and the new value is 2. apples was 3 and += 1 makes 4." },
    { type: "code", mode: "fix", prompt: py`<p><code>count_letters("aab")</code> should return <code>{"a": 2, "b": 1}</code> but the program crashes. Fix the function.</p>`,
      starter: py`def count_letters(text):
    counts = {}
    for ch in text:
        counts[ch] += 1
    return counts

print(count_letters("aab"))
`, solution: py`def count_letters(text):
    counts = {}
    for ch in text:
        counts[ch] = counts.get(ch, 0) + 1
    return counts

print(count_letters("aab"))`, hint: ["Read the error: which key is it complaining about?", "The first time a letter appears it isn't in the dict yet, so you can't add to it.", "Use counts.get(ch, 0) + 1"],
      tests: py`assert count_letters("aab") == {"a": 2, "b": 1} and count_letters("") == {}`, explain: "Reading a missing key raises KeyError. get() with a default solves it." },
    { type: "quiz", q: "What is len() of this dict?", code: `{"a": 1, "b": 2, "a": 3}`, options: ["2", "3", "1", "It crashes"], answer: 0, why: [null, "A dict can't hold the same key twice: the second \"a\" replaces the first.", "There are two different keys, a and b.", "Repeating a key is allowed, it just overwrites the earlier value."], explain: "Keys are unique. {'a': 3, 'b': 2} is what you really get." },
    { type: "code", prompt: py`<p>Write <code>unique_sorted(items)</code> returning the distinct items as a sorted list.</p>`,
      starter: py`def unique_sorted(items):
    pass
`, solution: py`def unique_sorted(items):
    return sorted(set(items))`, hint: ["Which collection throws duplicates away?", "A set removes duplicates, and sorted() puts things in order.", "return sorted(set(items))"],
      tests: py`assert unique_sorted([3, 1, 3, 2, 1]) == [1, 2, 3] and unique_sorted([]) == [] and unique_sorted(["b", "a", "b"]) == ["a", "b"]` },
    { type: "code", boss: true, prompt: py`<p><b>Boss challenge, no hints.</b> Write <code>group_by_length(words)</code> returning a dict from word length to the list of words with that length, in their original order. <code>group_by_length(["hi", "cat", "yo"])</code> is <code>{2: ["hi", "yo"], 3: ["cat"]}</code>.</p>`,
      starter: py`def group_by_length(words):
    pass
`, solution: py`def group_by_length(words):
    groups = {}
    for w in words:
        groups.setdefault(len(w), []).append(w)
    return groups`,
      tests: py`assert group_by_length(["hi", "cat", "yo"]) == {2: ["hi", "yo"], 3: ["cat"]}
assert group_by_length([]) == {}
assert group_by_length(["a", "b", "a"]) == {1: ["a", "b", "a"]}` },
  ]},
  { id: "comprehensions", rev: 2, needs: ["lists", "functions"], level: 2, title: "Comprehensions", blurb: "Build collections in one line", steps: [
    { type: "predict", probe: true, ask: "Before we start: what do you think this prints?", code: py`print([x * x for x in range(4)])`, answer: "[0, 1, 4, 9]", explain: "It reads like English: 'x times x, for every x in range(4)'. It builds a new list from a loop, in one line." },
    { type: "learn", title: "Loops in one line", html: py`
      <p>A <b>comprehension</b> builds a list (or a dict or set) from a loop. Compare the two ways to get the same squares:</p>
      <pre data-try><code>squares = []
for x in range(5):
    squares.append(x * x)
print(squares)

print([x * x for x in range(5)])</code></pre>
      <p>The pattern is <code>[expression for item in iterable if condition]</code>, and the <code>if</code> part is optional:</p>
      <pre data-try><code>evens = [x for x in range(10) if x % 2 == 0]
lengths = {w: len(w) for w in ["hi", "python"]}
print(evens, lengths)</code></pre>
      <p><b>Your turn:</b> change the condition so you get the odd numbers.</p>` },
    { type: "fill", prompt: py`<p>Keep the numbers bigger than 4, then double them. It should print <code>[16, 10, 24]</code>.</p>`,
      template: py`nums = [3, 8, 5, 12]
big = [n for n in nums ___ n > 4]
doubled = [n ___ 2 for n in big]
print(doubled)
`, blanks: ["if", "*"], hint: ["The filter comes at the end of a comprehension. Which keyword starts a condition?", "Doubling is multiplying by 2."],
      tests: py`assert output.strip() == "[16, 10, 24]"`, explain: "The pieces are always in the same order: what to build, the loop, then an optional filter." },
    { type: "predict", code: py`words = ["tea", "coffee", "milk"]
print([w.upper() for w in words if len(w) > 3])`, answer: "['COFFEE', 'MILK']", explain: "Only words longer than 3 letters pass the filter, and each one is made uppercase. 'tea' has exactly 3, so it is dropped." },
    { type: "code", mode: "fix", prompt: py`<p><code>squares_of_evens([1, 2, 3, 4])</code> should return <code>[4, 16]</code>, but the program doesn't even start. Fix it.</p>`,
      starter: py`def squares_of_evens(nums):
    return [n * n if n % 2 == 0 for n in nums]

print(squares_of_evens([1, 2, 3, 4]))
`, solution: py`def squares_of_evens(nums):
    return [n * n for n in nums if n % 2 == 0]

print(squares_of_evens([1, 2, 3, 4]))`, hint: ["Read the error message and find where Python got confused.", "A filter goes after the loop part, not before it."],
      tests: py`assert squares_of_evens([1, 2, 3, 4]) == [4, 16] and squares_of_evens([]) == [] and squares_of_evens([5, 7]) == []`, explain: "Order matters: [expression for item in iterable if condition]." },
    { type: "quiz", q: "What does this produce?", code: "[x for x in range(10) if x % 3 == 0]", options: ["[0, 3, 6, 9]", "[3, 6, 9]", "[0, 1, 2]", "[1, 4, 7]"], answer: 0, why: [null, "range(10) starts at 0, and 0 % 3 is 0, so 0 passes the filter.", "That's the first three numbers, not the multiples of 3.", "Those leave a remainder of 1. The filter keeps remainder 0."], explain: "0, 3, 6 and 9 are the multiples of 3 below 10." },
    { type: "code", prompt: py`<p>Write <code>flatten(matrix)</code> turning a list of lists into one flat list: <code>[[1, 2], [3]]</code> becomes <code>[1, 2, 3]</code>. Use one comprehension with two <code>for</code> parts.</p>`,
      starter: py`def flatten(matrix):
    pass
`, solution: py`def flatten(matrix):
    return [x for row in matrix for x in row]`, hint: ["A comprehension can have two for parts, written in the same order as nested loops.", "First loop over the rows, then over the items in each row.", "[x for row in matrix for x in row]"],
      tests: py`assert flatten([[1, 2], [3], []]) == [1, 2, 3] and flatten([]) == []` },
    { type: "code", boss: true, prompt: py`<p><b>Boss challenge, no hints.</b> Write <code>long_words(words, n)</code> returning a dict from each word longer than <code>n</code> letters to its length, using a dict comprehension. <code>long_words(["hi", "python", "code"], 3)</code> is <code>{"python": 6, "code": 4}</code>.</p>`,
      starter: py`def long_words(words, n):
    pass
`, solution: py`def long_words(words, n):
    return {w: len(w) for w in words if len(w) > n}`,
      tests: py`assert long_words(["hi", "python", "code"], 3) == {"python": 6, "code": 4}
assert long_words([], 1) == {} and long_words(["a"], 5) == {}` },
  ]},
  { id: "contacts", kind: "project", needs: ["dicts", "functions"], level: 2, title: "Mini: Contact Book", blurb: "Store, find and update people with a dict of dicts", steps: [
    { type: "learn", title: "Data first", html: py`
      <p>Most programs are really about <b>data plus a few functions</b>. A contact book is a dict that maps a name to the person's details, which is itself a dict:</p>
      <pre data-try><code>book = {
    "Ada": {"phone": "555-0100", "city": "London"},
    "Bo": {"phone": "555-0101", "city": "Oslo"},
}
print(book["Ada"]["city"])
book["Bo"]["city"] = "Bergen"
print(book["Bo"])</code></pre>
      <p>You will write the functions that keep the book tidy and safe.</p>` },
    { type: "code", prompt: py`<p><b>Piece 1.</b> Write <code>add_contact(book, name, phone, city="Unknown")</code>. It stores <code>{"phone": phone, "city": city}</code> under the name and returns <code>True</code>. If the name already exists it must change nothing and return <code>False</code>.</p>`,
      starter: py`def add_contact(book, name, phone, city="Unknown"):
    pass
`, solution: py`def add_contact(book, name, phone, city="Unknown"):
    if name in book:
        return False
    book[name] = {"phone": phone, "city": city}
    return True`, hint: "Check 'name in book' first and return False early.",
      tests: py`b = {}
assert add_contact(b, "Ada", "555-1") is True
assert b == {"Ada": {"phone": "555-1", "city": "Unknown"}}
assert add_contact(b, "Ada", "999", "Paris") is False
assert b["Ada"]["phone"] == "555-1", "an existing contact must not be overwritten"` },
    { type: "code", prompt: py`<p><b>Piece 2.</b> Write <code>find_by_city(book, city)</code> returning a sorted list of names living in that city (case-insensitive).</p>`,
      starter: py`def find_by_city(book, city):
    pass
`, solution: py`def find_by_city(book, city):
    return sorted(n for n, info in book.items() if info["city"].lower() == city.lower())`, hint: "Loop over book.items() and compare lowercased cities.",
      tests: py`b = {"Cy": {"phone": "1", "city": "Oslo"}, "Ada": {"phone": "2", "city": "oslo"}, "Bo": {"phone": "3", "city": "Rome"}}
assert find_by_city(b, "OSLO") == ["Ada", "Cy"]
assert find_by_city(b, "Mars") == []` },
    { type: "code", prompt: py`<p><b>Piece 3.</b> Write <code>rename(book, old, new)</code> moving the details to the new name. Raise <code>KeyError</code> if <code>old</code> is missing and <code>ValueError</code> if <code>new</code> is already taken.</p>`,
      starter: py`def rename(book, old, new):
    pass
`, solution: py`def rename(book, old, new):
    if old not in book:
        raise KeyError(old)
    if new in book:
        raise ValueError(f"{new} already exists")
    book[new] = book.pop(old)`, hint: "dict.pop(key) removes the key and hands back its value.",
      tests: py`b = {"Ada": {"phone": "1", "city": "X"}, "Bo": {"phone": "2", "city": "Y"}}
rename(b, "Ada", "Ada L")
assert "Ada" not in b and b["Ada L"]["phone"] == "1"
for old, new, exc in (("Nope", "Z", KeyError), ("Bo", "Ada L", ValueError)):
    try:
        rename(b, old, new)
    except exc:
        pass
    else:
        raise AssertionError(f"rename({old!r}, {new!r}) should raise {exc.__name__}")
assert set(b) == {"Ada L", "Bo"}` },
  ]},
  { id: "wordfreq", kind: "project", needs: ["contacts", "comprehensions"], level: 2, title: "Mini: Word Frequency", blurb: "Count the words in a text and rank them", steps: [
    { type: "learn", title: "What is in this text?", html: py`
      <p>Search engines, spell checkers and writing tools all start with <b>counting words</b>. You will clean text, count it with a dict, and rank the result.</p>
      <pre data-try><code>text = "the cat and the hat"
counts = {}
for word in text.split():
    counts[word] = counts.get(word, 0) + 1
print(counts)
print(sorted(counts.items(), key=lambda kv: -kv[1]))</code></pre>` },
    { type: "code", prompt: py`<p><b>Piece 1.</b> Write <code>words(text)</code> returning a list of lowercase words, with punctuation (<code>.,!?;:"</code>) removed. <code>words("Hi, THERE! Hi.")</code> is <code>["hi", "there", "hi"]</code>.</p>`,
      starter: py`def words(text):
    pass
`, solution: py`def words(text):
    cleaned = "".join(ch for ch in text.lower() if ch not in ".,!?;:\"")
    return cleaned.split()`, hint: "Lowercase, drop punctuation characters, then .split().",
      tests: py`assert words("Hi, THERE! Hi.") == ["hi", "there", "hi"]
assert words('"Wow;" she said: ok?') == ["wow", "she", "said", "ok"]
assert words("") == []` },
    { type: "code", prompt: py`<p><b>Piece 2.</b> Write <code>count(ws)</code> that takes a list of words and returns a dict of word to count.</p>`,
      starter: py`def count(ws):
    pass
`, solution: py`def count(ws):
    counts = {}
    for w in ws:
        counts[w] = counts.get(w, 0) + 1
    return counts`, hint: "counts.get(w, 0) + 1 handles the first time you see a word.",
      tests: py`assert count(["a", "b", "a"]) == {"a": 2, "b": 1}
assert count([]) == {}` },
    { type: "code", prompt: py`<p><b>Piece 3.</b> Write <code>top(text, n)</code> returning the <code>n</code> most common words as <code>(word, count)</code> tuples. Highest count first; words with equal counts in alphabetical order. Reuse <code>words</code> and <code>count</code>.</p>`,
      starter: py`def words(text):
    cleaned = "".join(ch for ch in text.lower() if ch not in ".,!?;:\"")
    return cleaned.split()

def count(ws):
    counts = {}
    for w in ws:
        counts[w] = counts.get(w, 0) + 1
    return counts

def top(text, n):
    pass
`, solution: py`def words(text):
    cleaned = "".join(ch for ch in text.lower() if ch not in ".,!?;:\"")
    return cleaned.split()

def count(ws):
    counts = {}
    for w in ws:
        counts[w] = counts.get(w, 0) + 1
    return counts

def top(text, n):
    ranked = sorted(count(words(text)).items(), key=lambda kv: (-kv[1], kv[0]))
    return ranked[:n]`, hint: "A sort key can be a tuple: (-count, word) sorts by count descending, then A to Z.",
      tests: py`t = "The cat and the hat. The end, and THE cat!"
assert top(t, 2) == [("the", 4), ("and", 2)]
assert top(t, 3) == [("the", 4), ("and", 2), ("cat", 2)]
assert top("", 3) == []` },
    { type: "predict", code: py`counts = {"b": 2, "a": 2, "c": 5}
ranked = sorted(counts.items(), key=lambda kv: (-kv[1], kv[0]))
print(ranked[0][0], ranked[1][0], ranked[2][0])`, answer: py`c a b` },
  ]},
  ]
},
{
  id: "ds", title: "Data Structures", desc: "Stacks, queues, linked lists, hashing and trees", color: "sky",
  lessons: [
  { id: "stacks", rev: 2, needs: ["lists", "functions"], level: 2, title: "Stacks", blurb: "Last in, first out", steps: [
    { type: "predict", probe: true, ask: "Before we start: what do you think this prints?", code: py`plates = ["red"]
plates.append("blue")
plates.append("green")
print(plates.pop(), plates.pop())`, answer: "green blue", explain: "pop() takes the item from the end, the most recent one. A stack gives you back the last thing you put in: last in, first out." },
    { type: "learn", title: "Think of a stack of plates", html: py`
      <p>A <b>stack</b> is last-in, first-out (LIFO). You only touch the top. In Python a list works perfectly:</p>
      <pre data-try><code>stack = []
stack.append("a")   # push
stack.append("b")
stack.pop()         # "b"  (pop from top)
stack[-1]           # peek</code></pre>
      <p>Both push and pop are <b>O(1)</b>. Stacks power undo buttons, browser history, the call stack, and bracket matching.</p>` },
    { type: "fill", prompt: py`<p>Push <code>"a"</code> and then <code>"b"</code> onto the stack, then take one off. It should print <code>b</code>.</p>`,
      template: py`stack = []
stack.___("a")
stack.___("b")
print(stack.___())
`, blanks: ["append", "append", "pop"], hint: ["A list becomes a stack if you only work at its end.", "append adds to the end (push), and pop takes from the end."],
      tests: py`assert output.strip() == "b"`, explain: "append and pop both work on the end of the list, which is exactly what a stack needs." },
    { type: "order", prompt: py`<p>Reverse a string with a stack: push every letter, then pop them all back. Put the lines in order; one doesn't belong.</p>`,
      lines: ["def reverse_text(text):", "    stack = []", "    for ch in text:", "        stack.append(ch)", `    result = ""`, "    while stack:", "        result += stack.pop()", "    return result"], distractors: ["        result += stack.pop(0)"],
      hint: ["First push everything, then pop everything.", "The loop that pushes comes before the loop that pops."],
      tests: py`assert reverse_text("abc") == "cba" and reverse_text("") == "" and reverse_text("python") == "nohtyp"`,
      explain: "Whatever goes in last comes out first, so a stack reverses things for free." },
    { type: "predict", code: py`stack = []
for ch in "abc":
    stack.append(ch)
print(stack.pop())
print(stack)`,
      answer: py`c
['a', 'b']` },
    { type: "code", mode: "fix", prompt: py`<p><code>peek(stack)</code> should show the <b>top</b> of the stack without removing it. For <code>[1, 2, 3]</code> it should print <code>3</code>, but it doesn't. Fix it.</p>`,
      starter: py`def peek(stack):
    return stack[0]

s = [1, 2, 3]
print(peek(s))
`, solution: py`def peek(stack):
    return stack[-1]

s = [1, 2, 3]
print(peek(s))`, hint: ["Which end of the list is the top of the stack?", "Items are pushed at the end, so the top is the last one."],
      tests: py`assert output.strip() == "3"
assert peek([1, 2, 3]) == 3 and peek(["a"]) == "a"`, explain: "The top of a list-based stack is index -1." },
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
    { type: "code", boss: true, prompt: py`<p>Evaluate a postfix (RPN) expression. <code>evaluate_rpn(["2","3","+","4","*"])</code> is <code>(2+3)*4 = 20</code>. Support <code>+ - * </code>.</p>`,
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
  ]},
  { id: "queues", rev: 2, needs: ["stacks"], level: 2, title: "Queues", blurb: "First in, first out", steps: [
    { type: "predict", probe: true, ask: "Before we start: what do you think this prints?", code: py`from collections import deque
line = deque(["Ann", "Bo"])
line.append("Cy")
print(line.popleft())
print(len(line))`, answer: py`Ann
2`, explain: "People join at the back (append) and are served from the front (popleft). Ann arrived first, so Ann leaves first: first in, first out." },
    { type: "learn", title: "Waiting in line", html: py`
      <p>A <b>queue</b> is first-in, first-out (FIFO). New items join the back; items leave from the front.</p>
      <p>Don't use <code>list.pop(0)</code>: it shifts every element, so it's <b>O(n)</b>. Use <code>collections.deque</code>, where both ends are <b>O(1)</b>:</p>
      <pre data-try><code>from collections import deque
q = deque()
q.append("a")      # enqueue
q.append("b")
q.popleft()        # "a"  dequeue</code></pre>` },
    { type: "fill", prompt: py`<p>Add <code>1</code> and <code>2</code> to the queue, then serve the first person. It should print <code>1</code>.</p>`,
      template: py`from collections import deque
q = deque()
q.___(1)
q.append(2)
print(q.___())
`, blanks: ["append", "popleft"], hint: ["append joins the back of the line.", "To serve the front you need popleft, not pop."],
      tests: py`assert output.strip() == "1"`, explain: "popleft takes from the front. A plain pop() would take from the back, like a stack." },
    { type: "order", prompt: py`<p>Serve everyone in the line, one at a time, until it is empty. It should print <code>1</code>, <code>2</code>, <code>3</code>. One line is a trap.</p>`,
      lines: ["from collections import deque", "q = deque([1, 2, 3])", "while q:", "    print(q.popleft())"], distractors: ["    print(q.pop())"],
      hint: ["Import and create the queue first.", "while q: keeps going as long as the queue isn't empty."],
      tests: py`assert output.split() == ["1", "2", "3"]`, explain: "An empty queue counts as False, so 'while q:' is the classic way to drain one." },
    { type: "predict", code: py`from collections import deque

q = deque([1, 2, 3])
q.append(4)
print(q.popleft(), q.popleft())
print(list(q))`,
      answer: py`1 2
[3, 4]` },
    { type: "code", mode: "fix", prompt: py`<p>Ann was first in line, so she should be served first. It should print <code>Ann</code> but doesn't. Fix it.</p>`,
      starter: py`from collections import deque
q = deque()
for name in ["Ann", "Bo", "Cy"]:
    q.append(name)
print(q.pop())
`, solution: py`from collections import deque
q = deque()
for name in ["Ann", "Bo", "Cy"]:
    q.append(name)
print(q.popleft())`, hint: ["Look at who was served. Which end did pop() take from?", "A queue serves from the front: popleft."],
      tests: py`assert output.strip() == "Ann"`, explain: "pop() works on the right end (stack behaviour). A queue needs popleft()." },
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
    { type: "code", boss: true, prompt: py`<p><b>Boss challenge, no hints.</b> <code>n</code> people stand in a circle, numbered 1 to n. Starting at 1, every <code>k</code>-th person leaves, and counting continues round the circle. Write <code>last_survivor(n, k)</code> returning the number of the last person left. For <code>n = 7, k = 3</code> the answer is <code>4</code>.</p>`,
      starter: py`from collections import deque

def last_survivor(n, k):
    pass
`, solution: py`from collections import deque

def last_survivor(n, k):
    circle = deque(range(1, n + 1))
    while len(circle) > 1:
        for _ in range(k - 1):
            circle.append(circle.popleft())
        circle.popleft()
    return circle[0]`,
      tests: py`assert last_survivor(7, 3) == 4 and last_survivor(1, 5) == 1 and last_survivor(5, 2) == 3 and last_survivor(10, 1) == 10` },
  ]},
  { id: "linked", rev: 2, needs: ["stacks", "recursion"], level: 3, title: "Linked Lists", blurb: "Nodes pointing to nodes", steps: [
    { type: "predict", probe: true, ask: "Before we start: what do you think this prints?", code: py`class Node:
    def __init__(self, value, next=None):
        self.value = value
        self.next = next

head = Node(1, Node(2, Node(3)))
print(head.next.next.value)`, answer: "3", explain: "Each node points to the next one. head.next is the second node, head.next.next is the third, and its value is 3." },
    { type: "learn", title: "A chain of nodes", html: py`
      <p>A <b>linked list</b> stores each value in a node that points to the next one. No contiguous memory is needed.</p>
      <pre data-try><code>class Node:
    def __init__(self, value, next=None):
        self.value = value
        self.next = next

head = Node(1, Node(2, Node(3)))   # 1 -> 2 -> 3</code></pre>
      <p>Inserting at the head is <b>O(1)</b>, but reaching the k-th item means walking k nodes: <b>O(n)</b>. Lists are the opposite.</p>` },
    { type: "fill", prompt: py`<p>Walk the chain from the head and print every value. It should print <code>a</code>, <code>b</code>, <code>c</code> on separate lines.</p>`,
      template: py`class Node:
    def __init__(self, value, next=None):
        self.value = value
        self.next = next

head = Node("a", Node("b", Node("c")))
node = head
while node ___ None:
    print(node.value)
    node = node.___
`, blanks: ["is not", "next"], hint: ["The chain ends at None, so keep going while the node is something.", "To move along, replace node with the node it points to."],
      tests: py`assert output.split() == ["a", "b", "c"]`, explain: "Walking a linked list is always the same loop: use the node, then step to node.next." },
    { type: "order", prompt: py`<p>Count the nodes in a linked list. One line is a trap.</p>`,
      lines: ["def count(head):", "    total = 0", "    while head:", "        total += 1", "        head = head.next", "    return total"], distractors: ["        head = head.prev"],
      hint: ["Start the counter before the loop, return after it.", "Inside the loop: count one, then step to the next node."],
      tests: py`class N:
    def __init__(self, value, next=None):
        self.value, self.next = value, next
assert count(None) == 0 and count(N(1)) == 1 and count(N(1, N(2, N(3)))) == 3`, explain: "A node is truthy and None is falsy, so 'while head:' stops at the end of the chain." },
    { type: "code", mode: "fix", prompt: py`<p><code>to_list</code> should collect every value, so this should print <code>[1, 2, 3]</code>. It misses one. Fix it.</p>`,
      starter: py`class Node:
    def __init__(self, value, next=None):
        self.value = value
        self.next = next

def to_list(head):
    out = []
    while head.next:
        out.append(head.value)
        head = head.next
    return out

print(to_list(Node(1, Node(2, Node(3)))))
`, solution: py`class Node:
    def __init__(self, value, next=None):
        self.value = value
        self.next = next

def to_list(head):
    out = []
    while head:
        out.append(head.value)
        head = head.next
    return out

print(to_list(Node(1, Node(2, Node(3)))))`, hint: ["Which node gets left out, and why does the loop stop before it?", "The last node has next = None, so the loop ends before using it. Test the node itself instead."],
      tests: py`assert to_list(Node(1, Node(2, Node(3)))) == [1, 2, 3] and to_list(Node(9)) == [9] and to_list(None) == []`, explain: "Loop while the node exists (while head:), not while it has a next, or you skip the last one and crash on an empty list." },
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
    { type: "code", boss: true, prompt: py`<p>Write <code>reverse(head)</code> that reverses the list in O(n) time and returns the new head.</p>`,
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
  { id: "hashing", rev: 2, needs: ["dicts"], level: 3, title: "Hash Maps", blurb: "How dicts are so fast", steps: [
    { type: "predict", probe: true, ask: "Before we start: what do you think this prints?", code: py`seen = {}
seen["a"] = 1
seen["a"] = 2
print(len(seen), seen["a"])`, answer: "1 2", explain: "A key is unique. Writing to an existing key replaces its value rather than adding a second entry." },
    { type: "learn", title: "Hashing in a nutshell", html: py`
      <p>A dict turns each key into a number with a <b>hash function</b>, and uses it to jump straight to the right slot. That's why lookup, insert and delete are <b>O(1)</b> on average.</p>
      <p>Keys must be <b>hashable</b> (immutable): strings, numbers and tuples work; lists and dicts don't.</p>
      <pre data-try><code>seen = {}
seen[(1, 2)] = "ok"       # tuple key: fine
# seen[[1, 2]] = "no"     # TypeError: unhashable type</code></pre>
      <p>Whenever you catch yourself searching a list again and again, ask: <i>could a dict or set do this?</i></p>` },
    { type: "fill", prompt: py`<p>Count how often each word appears, then print how many times <code>go</code> occurs (<code>3</code>).</p>`,
      template: py`words = ["go", "stop", "go", "run", "stop", "go"]
counts = {}
for w in words:
    counts[w] = counts.___(w, 0) + ___
print(counts["go"])
`, blanks: ["get", "1"], hint: ["get returns a default when the key is missing.", "Each time you see the word, add one."],
      tests: py`assert output.strip() == "3"`, explain: "Counting with a dict is the most common hash map pattern: get(key, 0) + 1." },
    { type: "order", prompt: py`<p>Write <code>has_duplicate(items)</code>: return <code>True</code> as soon as you meet an item you have already seen. One line is a trap.</p>`,
      lines: ["def has_duplicate(items):", "    seen = set()", "    for x in items:", "        if x in seen:", "            return True", "        seen.add(x)", "    return False"], distractors: ["        seen.append(x)"],
      hint: ["Make the empty set first. Check membership before adding.", "If x is already in seen, return True. Otherwise add it. Return False after the loop."],
      tests: py`assert has_duplicate([1, 2, 3, 1]) is True and has_duplicate([1, 2, 3]) is False and has_duplicate([]) is False
big = list(range(100000)) + [0]
_, t = timed(has_duplicate, big)
assert t < 0.5, "a set lookup is O(1), so this should be instant"`, explain: "Checking 'x in seen' on a set is O(1), so the whole function is O(n)." },
    { type: "predict", code: py`seen = set()
for x in [1, 2, 2, 3, 1]:
    if x in seen:
        print("dup", x)
    seen.add(x)`,
      answer: py`dup 2
dup 1` },
    { type: "code", mode: "fix", prompt: py`<p>We want to remember that the cell <code>(1, 2)</code> was visited, but this crashes. Fix it so it prints <code>{(1, 2): 'yes'}</code>.</p>`,
      starter: py`visited = {}
visited[[1, 2]] = "yes"
print(visited)
`, solution: py`visited = {}
visited[(1, 2)] = "yes"
print(visited)`, hint: ["Read the error: it says what kind of key is not allowed.", "Dict keys must not be changeable. Which type is like a list but fixed?"],
      tests: py`assert output.strip() == "{(1, 2): 'yes'}"`, explain: "Keys must be hashable (immutable): use a tuple instead of a list." },
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
    { type: "code", boss: true, prompt: py`<p>Write <code>group_anagrams(words)</code> returning a list of groups of words that are anagrams. Keep groups in order of first appearance and words in input order.</p>`,
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
  ]},
  { id: "trees", rev: 2, needs: ["linked"], level: 3, title: "Binary Trees", blurb: "Hierarchies and search trees", steps: [
    { type: "predict", probe: true, ask: "Before we start: what do you think this prints?", code: py`class Node:
    def __init__(self, value, left=None, right=None):
        self.value = value
        self.left = left
        self.right = right

tree = Node(2, Node(1), Node(3))
print(tree.left.value, tree.value, tree.right.value)`, answer: "1 2 3", explain: "A tree node holds a value and points to up to two children. Here 2 is the parent, with 1 on its left and 3 on its right." },
    { type: "learn", title: "Trees branch", html: py`
      <p>A <b>tree</b> is nodes with children. In a <b>binary search tree</b> (BST) every node has at most two children: smaller values go left, larger go right.</p>
      <pre><code>        8
       / \
      3   10
     / \    \
    1   6    14</code></pre>
      <p>Searching follows one branch per level, so a balanced BST needs only about <b>log₂ n</b> steps. An <b>in-order traversal</b> (left, node, right) visits values in sorted order.</p>` },
    { type: "fill", prompt: py`<p>Searching a binary search tree: smaller targets live on the left, bigger ones on the right. Complete the search.</p>`,
      template: py`def contains(node, target):
    if node is None:
        return False
    if target == node.value:
        return True
    if target < node.value:
        return contains(node.___, target)
    return contains(node.___, target)
`, blanks: ["left", "right"], hint: ["Smaller values are stored on the left of a node.", "If the target is smaller go left, otherwise go right."],
      tests: py`class N:
    def __init__(self, value, left=None, right=None):
        self.value, self.left, self.right = value, left, right
tree = N(8, N(3, N(1), N(6)), N(10, None, N(14)))
assert all(contains(tree, v) for v in (8, 3, 10, 1, 6, 14))
assert not any(contains(tree, v) for v in (0, 5, 9, 20)) and contains(None, 1) is False`, explain: "Each step throws away half of the remaining tree, so a balanced tree needs only about log n steps." },
    { type: "order", prompt: py`<p>Write <code>height(node)</code>, the number of levels in a tree (an empty tree has height 0). One line is a trap.</p>`,
      lines: ["def height(node):", "    if node is None:", "        return 0", "    return 1 + max(height(node.left), height(node.right))"], distractors: ["return 0"],
      hint: ["Handle the empty tree first: that is the base case.", "Otherwise it is 1 plus the taller of the two subtrees."],
      tests: py`class N:
    def __init__(self, value, left=None, right=None):
        self.value, self.left, self.right = value, left, right
assert height(None) == 0 and height(N(1)) == 1 and height(N(1, N(2, N(3)), N(4))) == 3`, explain: "Tree problems are almost always recursive: solve for the children, then combine." },
    { type: "predict", code: py`class Node:
    def __init__(self, value, left=None, right=None):
        self.value = value
        self.left = left
        self.right = right

def inorder(node):
    if node is None:
        return []
    return inorder(node.left) + [node.value] + inorder(node.right)

tree = Node(4, Node(2, Node(1), Node(3)), Node(5))
print(inorder(tree))`, answer: "[1, 2, 3, 4, 5]", explain: "In-order means left subtree, then the node, then the right subtree. In a search tree that always gives sorted order." },
    { type: "code", mode: "fix", prompt: py`<p>This tree should keep smaller values on the left, so its in-order listing is sorted: <code>[1, 2, 3, 4, 5]</code>. It isn't. Fix <code>insert</code>.</p>`,
      starter: py`class Node:
    def __init__(self, value):
        self.value = value
        self.left = None
        self.right = None

def insert(node, value):
    if node is None:
        return Node(value)
    if value < node.value:
        node.right = insert(node.right, value)
    else:
        node.left = insert(node.left, value)
    return node

def inorder(node):
    return inorder(node.left) + [node.value] + inorder(node.right) if node else []

root = None
for v in [4, 2, 5, 1, 3]:
    root = insert(root, v)
print(inorder(root))
`, solution: py`class Node:
    def __init__(self, value):
        self.value = value
        self.left = None
        self.right = None

def insert(node, value):
    if node is None:
        return Node(value)
    if value < node.value:
        node.left = insert(node.left, value)
    else:
        node.right = insert(node.right, value)
    return node

def inorder(node):
    return inorder(node.left) + [node.value] + inorder(node.right) if node else []

root = None
for v in [4, 2, 5, 1, 3]:
    root = insert(root, v)
print(inorder(root))`, hint: ["Look at the output: the order is reversed.", "Smaller values must go left, bigger ones right. Check which branch each case takes."],
      tests: py`assert output.strip() == "[1, 2, 3, 4, 5]"
r = None
for v in [8, 3, 10, 1, 6]:
    r = insert(r, v)
assert inorder(r) == [1, 3, 6, 8, 10]`, explain: "The whole point of a search tree is the rule: smaller left, larger right. Break it and searching breaks." },
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
    { type: "code", boss: true, prompt: py`<p>Add <code>contains(value)</code> and <code>height()</code> (a single node has height 1).</p>`,
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
  { id: "history", kind: "project", needs: ["stacks", "errors"], level: 2, title: "Mini: Browser History", blurb: "Back and forward buttons from two stacks", steps: [
    { type: "learn", title: "Two stacks make a browser", html: py`
      <p>Your browser's back and forward buttons are two <b>stacks</b>. Pages you left go on the <i>back</i> stack. When you press back, the page you were on moves to the <i>forward</i> stack.</p>
      <pre data-try><code>back, forward = [], []
current = "home"
for page in ["news", "mail"]:
    back.append(current)
    current = page
print(current, back)

forward.append(current)
current = back.pop()
print(current, back, forward)</code></pre>
      <p>Visiting a new page always throws the forward stack away, just like a real browser.</p>` },
    { type: "code", prompt: py`<p><b>Piece 1.</b> Complete the class: <code>visit(url)</code> pushes the current page on <code>back</code>, makes <code>url</code> current and clears <code>forward</code>.</p>`,
      starter: py`class History:
    def __init__(self, home):
        self.current = home
        self.back_stack = []
        self.forward_stack = []

    def visit(self, url):
        pass
`, solution: py`class History:
    def __init__(self, home):
        self.current = home
        self.back_stack = []
        self.forward_stack = []

    def visit(self, url):
        self.back_stack.append(self.current)
        self.current = url
        self.forward_stack.clear()`, hint: "Three lines: push current, set current, clear forward.",
      tests: py`h = History("home")
h.visit("news")
h.visit("mail")
assert h.current == "mail" and h.back_stack == ["home", "news"] and h.forward_stack == []` },
    { type: "code", prompt: py`<p><b>Piece 2.</b> Add <code>back()</code> and <code>forward()</code>. Each returns the new current page, or leaves everything unchanged and returns the current page if there is nowhere to go.</p>`,
      starter: py`class History:
    def __init__(self, home):
        self.current = home
        self.back_stack = []
        self.forward_stack = []

    def visit(self, url):
        self.back_stack.append(self.current)
        self.current = url
        self.forward_stack.clear()

    def back(self):
        pass

    def forward(self):
        pass
`, solution: py`class History:
    def __init__(self, home):
        self.current = home
        self.back_stack = []
        self.forward_stack = []

    def visit(self, url):
        self.back_stack.append(self.current)
        self.current = url
        self.forward_stack.clear()

    def back(self):
        if self.back_stack:
            self.forward_stack.append(self.current)
            self.current = self.back_stack.pop()
        return self.current

    def forward(self):
        if self.forward_stack:
            self.back_stack.append(self.current)
            self.current = self.forward_stack.pop()
        return self.current`, hint: "back moves current onto forward and pops back; forward is the mirror image.",
      tests: py`h = History("home")
assert h.back() == "home", "nowhere to go back to"
h.visit("a"); h.visit("b"); h.visit("c")
assert h.back() == "b" and h.back() == "a"
assert h.forward() == "b"
h.visit("z")
assert h.forward() == "z", "visiting clears forward"
assert h.back() == "b"` },
    { type: "code", prompt: py`<p><b>Piece 3.</b> Add <code>trail()</code> returning the list of pages from oldest to the current one, e.g. <code>["home", "a", "b"]</code>.</p>`,
      starter: py`class History:
    def __init__(self, home):
        self.current = home
        self.back_stack = []
        self.forward_stack = []

    def visit(self, url):
        self.back_stack.append(self.current)
        self.current = url
        self.forward_stack.clear()

    def trail(self):
        pass
`, solution: py`class History:
    def __init__(self, home):
        self.current = home
        self.back_stack = []
        self.forward_stack = []

    def visit(self, url):
        self.back_stack.append(self.current)
        self.current = url
        self.forward_stack.clear()

    def trail(self):
        return self.back_stack + [self.current]`, hint: "The back stack is already oldest-first.",
      tests: py`h = History("home")
assert h.trail() == ["home"]
h.visit("a"); h.visit("b")
assert h.trail() == ["home", "a", "b"]` },
  ]},
  { id: "printq", kind: "project", needs: ["queues", "functions"], level: 2, title: "Mini: Print Queue", blurb: "A fair round-robin scheduler built on a deque", steps: [
    { type: "learn", title: "Taking turns", html: py`
      <p>Printers, CPUs and game servers share one resource between many jobs. The simplest fair rule is <b>round robin</b>: give each job a short turn, and if it is not finished send it to the back of the queue.</p>
      <pre data-try><code>from collections import deque
jobs = deque([("a", 3), ("b", 1), ("c", 2)])
job, left = jobs.popleft()
print(job, left)
jobs.append((job, left - 1))
print(list(jobs))</code></pre>` },
    { type: "code", prompt: py`<p><b>Piece 1.</b> Write <code>run(jobs, slice_size)</code>. <code>jobs</code> is a list of <code>(name, pages)</code>. Each turn prints up to <code>slice_size</code> pages of the first job; a job with pages left goes to the back. Return the list of job names in the order they <i>finish</i>.</p>`,
      starter: py`from collections import deque

def run(jobs, slice_size):
    pass
`, solution: py`from collections import deque

def run(jobs, slice_size):
    queue = deque(jobs)
    finished = []
    while queue:
        name, pages = queue.popleft()
        pages -= slice_size
        if pages > 0:
            queue.append((name, pages))
        else:
            finished.append(name)
    return finished`, hint: "popleft, subtract slice_size, then either append to the back or record it as finished.",
      tests: py`assert run([("a", 3), ("b", 1), ("c", 2)], 1) == ["b", "c", "a"]
assert run([("big", 10), ("tiny", 1)], 5) == ["tiny", "big"]
assert run([], 3) == []` },
    { type: "code", prompt: py`<p><b>Piece 2.</b> Write <code>waiting_times(jobs, slice_size)</code> returning a dict of job name to the number of <i>pages printed before that job finished</i> (its own pages included). Total pages printed so far, when the job completes.</p>`,
      starter: py`from collections import deque

def waiting_times(jobs, slice_size):
    pass
`, solution: py`from collections import deque

def waiting_times(jobs, slice_size):
    queue = deque(jobs)
    clock = 0
    done_at = {}
    while queue:
        name, pages = queue.popleft()
        used = min(pages, slice_size)
        clock += used
        if pages > used:
            queue.append((name, pages - used))
        else:
            done_at[name] = clock
    return done_at`, hint: "Keep a running clock of pages printed. A turn prints min(pages, slice_size).",
      tests: py`assert waiting_times([("a", 3), ("b", 1), ("c", 2)], 1) == {"b": 2, "c": 5, "a": 6}
assert waiting_times([("x", 4)], 10) == {"x": 4}` },
    { type: "quiz", q: "With one huge job first and many tiny jobs behind it, why is round robin fairer than 'first come, first served'?", options: ["It prints the huge job faster", "Tiny jobs get a turn early instead of waiting for the huge one to finish", "It uses less memory", "It reorders jobs alphabetically"], answer: 1, why: ["The huge job actually finishes later under round robin.", null, "Memory use is about the same.", "Order is by arrival, not by name."], explain: "Time slicing stops one long job from blocking everyone else." },
  ]},
  ]
},
{
  id: "algos", title: "Algorithms", desc: "Searching, sorting, recursion and graphs", color: "orange",
  lessons: [
  { id: "linear", rev: 2, needs: ["lists", "dicts"], level: 2, title: "Linear Search", blurb: "Check items one by one", steps: [
    { type: "predict", probe: true, ask: "Before we start: what do you think this prints?", code: py`def contains(arr, target):
    for x in arr:
        if x == target:
            return True
    return False

print(contains([4, 2, 7], 7), contains([4, 2, 7], 5))`, answer: "True False", explain: "The function checks the items one by one. It finds 7, but never finds 5 and has to look at every item before it gives up and returns False." },
    { type: "learn", title: "The simplest search", html: py`
      <p><b>Linear search</b> checks each item until it finds the target. It works on any list, sorted or not.</p>
      <pre data-try><code>def contains(arr, target):
    for x in arr:
        if x == target:
            return True
    return False

print(contains([4, 2, 7], 7))</code></pre>
      <p>In the worst case (target missing) it checks all <i>n</i> items: <b>O(n)</b>.</p>` },
    { type: "fill", prompt: py`<p>Complete <code>linear_search</code>: return the <b>position</b> of the first match, or <code>-1</code> if it isn't there.</p>`,
      template: py`def linear_search(arr, target):
    for i, x in ___(arr):
        if x == target:
            return ___
    return -1
`, blanks: ["enumerate", "i"], hint: ["You need each item and its position at the same time.", "enumerate gives (position, item) pairs. Return the position when you find a match."],
      tests: py`assert linear_search([4, 2, 7, 2], 2) == 1 and linear_search([4, 2, 7], 9) == -1 and linear_search([], 1) == -1 and linear_search(["a", "b"], "b") == 1`, explain: "enumerate is the clean way to loop when you also need the index." },
    { type: "order", prompt: py`<p>Count how many times <code>target</code> appears in a list. One line is a trap.</p>`,
      lines: ["def count_in(arr, target):", "    count = 0", "    for x in arr:", "        if x == target:", "            count += 1", "    return count"], distractors: ["        return count"],
      hint: ["Set the counter before the loop and return it after the loop.", "The += belongs inside the if."],
      tests: py`assert count_in([1, 2, 1, 1], 1) == 3 and count_in([], 5) == 0 and count_in(["a"], "b") == 0`, explain: "Unlike a search that stops at the first match, counting has to look at every item." },
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
    { type: "code", mode: "fix", prompt: py`<p><code>linear_search([4, 2, 7], 7)</code> should return <code>2</code> but returns <code>-1</code>. Find the bug.</p>`,
      starter: py`def linear_search(arr, target):
    for i, x in enumerate(arr):
        if x == target:
            return i
        else:
            return -1

print(linear_search([4, 2, 7], 7))
`, solution: py`def linear_search(arr, target):
    for i, x in enumerate(arr):
        if x == target:
            return i
    return -1

print(linear_search([4, 2, 7], 7))`, hint: ["Which item does the loop look at before it gives up?", "The else returns -1 after checking only the first item. Give up only after the loop has finished."],
      tests: py`assert output.strip() == "2"
assert linear_search([4, 2, 7], 7) == 2 and linear_search([4, 2, 7], 9) == -1 and linear_search([], 1) == -1`, explain: "'Not found' can only be decided after every item has been checked, so return -1 after the loop." },
    { type: "code", boss: true, prompt: py`<p>Write <code>find_max(arr)</code> without using <code>max()</code>. Return <code>None</code> for an empty list.</p>`,
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
  { id: "binary", rev: 2, needs: ["linear"], level: 3, title: "Binary Search", blurb: "Halve the problem each step", steps: [
    { type: "predict", probe: true, ask: "Before we start: what do you think this prints?", code: py`arr = [1, 3, 5, 7, 9, 11, 13]
lo, hi = 0, len(arr) - 1
mid = (lo + hi) // 2
print(mid, arr[mid])`, answer: "3 7", explain: "The middle position of 0..6 is 3, and arr[3] is 7. Binary search always starts by looking right in the middle." },
    { type: "learn", title: "Guess the number", html: py`
      <p>If a list is <b>sorted</b>, check the middle. Too high? Discard the upper half. Too low? Discard the lower half. Repeat.</p>
      <pre><code>lo, hi = 0, len(arr) - 1
while lo <= hi:
    mid = (lo + hi) // 2
    if arr[mid] == target: ...
    elif arr[mid] < target: lo = mid + 1
    else: hi = mid - 1</code></pre>
      <p>Each step halves the search space, so 1,000,000 items need at most ~20 steps: <b>O(log n)</b>.</p>` },
    { type: "fill", prompt: py`<p>Finish the halving step of binary search. After checking the middle you throw away the middle <i>and</i> the half that can't contain the target.</p>`,
      template: py`def binary_search(arr, target):
    lo, hi = 0, len(arr) - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if arr[mid] == target:
            return mid
        if arr[mid] < target:
            lo = mid + ___
        else:
            hi = mid ___ 1
    return -1
`, blanks: ["1", "-"], hint: ["mid has already been checked, so skip past it.", "Moving lo up uses +1. Moving hi down uses -1."],
      tests: py`assert binary_search([1, 3, 5, 7, 9], 7) == 3 and binary_search([1, 3, 5, 7, 9], 4) == -1 and binary_search([], 3) == -1 and binary_search([5], 5) == 0 and binary_search([1, 3, 5, 7], 1) == 0`, explain: "Moving past mid (mid + 1 or mid - 1) is what guarantees the range shrinks every time." },
    { type: "order", prompt: py`<p>How many times can you halve <code>n</code> before you reach 1? That is the number of steps binary search needs. One line is a trap.</p>`,
      lines: ["def halvings(n):", "    steps = 0", "    while n > 1:", "        n = n // 2", "        steps += 1", "    return steps"], distractors: ["        n = n - 1"],
      hint: ["Set up the counter first.", "Inside the loop: halve n, count one step."],
      tests: py`assert halvings(1) == 0 and halvings(8) == 3 and halvings(1023) == 9 and halvings(1_000_000) == 19`, explain: "A million items need only about 20 halvings. That is what O(log n) feels like." },
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
    { type: "code", mode: "fix", prompt: py`<p>Searching for 5 in a list that contains only 5 should give <code>0</code>, but this returns <code>-1</code>. Fix the loop condition.</p>`,
      starter: py`def binary_search(arr, target):
    lo, hi = 0, len(arr) - 1
    while lo < hi:
        mid = (lo + hi) // 2
        if arr[mid] == target:
            return mid
        if arr[mid] < target:
            lo = mid + 1
        else:
            hi = mid - 1
    return -1

print(binary_search([5], 5))
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
    return -1

print(binary_search([5], 5))`, hint: ["Try it by hand: lo and hi are both 0. Does the loop even start?", "When one candidate is left, lo == hi. The loop must still run then."],
      tests: py`assert output.strip() == "0"
assert binary_search([5], 5) == 0 and binary_search([1, 3, 5, 7], 7) == 3 and binary_search([1, 3, 5, 7], 4) == -1`, explain: "With lo == hi there is still one candidate left. The condition must be lo <= hi." },
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
    { type: "code", boss: true, prompt: py`<p>Write <code>lower_bound(arr, x)</code>: the first index whose value is <code>&gt;= x</code> (or <code>len(arr)</code> if none). It's the insertion point that keeps the list sorted.</p>`,
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
  ]},
  { id: "sorting", rev: 2, needs: ["linear", "recursion"], level: 3, title: "Sorting", blurb: "Bubble, selection and friends", steps: [
    { type: "predict", probe: true, ask: "Before we start: what do you think this prints?", code: py`a = [3, 1]
a[0], a[1] = a[1], a[0]
print(a)`, answer: "[1, 3]", explain: "Python can swap two values in one line, with no temporary variable. Swapping is the basic move behind most simple sorts." },
    { type: "learn", title: "Putting things in order", html: py`
      <p>Simple sorts compare and swap items repeatedly.</p>
      <ul>
        <li><b>Bubble sort</b>: repeatedly swap neighbours that are out of order.</li>
        <li><b>Selection sort</b>: pick the smallest remaining item and put it next.</li>
      </ul>
      <p>Both use two nested loops, so they take <b>O(n²)</b> time. Python's built-in <code>sorted()</code> uses Timsort: <b>O(n log n)</b>. In real code, use it!</p>` },
    { type: "fill", prompt: py`<p>One pass of bubble sort: compare neighbours and swap them if they are out of order. After one pass the list should be <code>[2, 3, 1, 4]</code>.</p>`,
      template: py`data = [4, 2, 3, 1]
for i in range(len(data) - 1):
    if data[i] ___ data[i + 1]:
        data[i], data[i + 1] = data[i + 1], data[___]
print(data)
`, blanks: [">", "i"], hint: ["Swap when the left one is bigger than the right one.", "The swap puts the old left value into the right slot, so the second blank is the left position."],
      tests: py`assert output.strip() == "[2, 3, 1, 4]"`, explain: "After one pass the biggest value has 'bubbled' to the end. Repeat the pass and the whole list is sorted." },
    { type: "order", prompt: py`<p>Selection sort needs a helper: find the position of the smallest value from <code>start</code> onwards. One line is a trap.</p>`,
      lines: ["def find_min_index(a, start):", "    best = start", "    for j in range(start + 1, len(a)):", "        if a[j] < a[best]:", "            best = j", "    return best"], distractors: ["        best = j"],
      hint: ["Assume the first candidate is the best, then look for a smaller one.", "Update best inside the if."],
      tests: py`assert find_min_index([5, 2, 9, 1, 7], 0) == 3 and find_min_index([5, 2, 9, 1, 7], 4) == 4 and find_min_index([5, 2, 9, 1, 7], 1) == 3 and find_min_index([4, 4], 0) == 0`, explain: "Scanning for the smallest is the heart of selection sort: find it, swap it into place, repeat." },
    { type: "predict", code: py`data = [3, 1, 2]
for i in range(len(data) - 1):
    if data[i] > data[i + 1]:
        data[i], data[i + 1] = data[i + 1], data[i]
print(data)`,
      answer: py`[1, 2, 3]` },
    { type: "code", mode: "fix", prompt: py`<p><code>is_sorted</code> should say whether a list is in order. It says <code>True</code> for <code>[3, 1, 2]</code>. Fix it.</p>`,
      starter: py`def is_sorted(a):
    for i in range(len(a) - 1):
        if a[i] > a[i + 1]:
            return False
        else:
            return True
    return True

print(is_sorted([3, 1, 2]), is_sorted([1, 2, 3]))
`, solution: py`def is_sorted(a):
    for i in range(len(a) - 1):
        if a[i] > a[i + 1]:
            return False
    return True

print(is_sorted([3, 1, 2]), is_sorted([1, 2, 3]))`, hint: ["Which pair of neighbours does the loop actually check?", "The else returns True after the very first pair. Only say True once every pair has passed."],
      tests: py`assert output.strip() == "False True"
assert is_sorted([]) and is_sorted([1]) and not is_sorted([2, 1]) and not is_sorted([1, 3, 2, 4])`, explain: "To be sure a list is sorted you must check every pair, so True can only come after the loop." },
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
    return a`, hint: ["Work on a copy so the input stays untouched.", "For each position i, find the smallest value in a[i:] and swap it into place.", "The inner loop finds the position of the smallest; then swap a[i] with it."],
      tests: py`assert "sorted(" not in source and ".sort(" not in source, "Implement the sort yourself"
data = [5, 2, 9, 1, 5, 6]
assert selection_sort(data) == [1, 2, 5, 5, 6, 9]
assert data == [5, 2, 9, 1, 5, 6], "Don't modify the original list"
assert selection_sort([]) == []
assert selection_sort([1]) == [1]` },
    { type: "code", boss: true, prompt: py`<p>Write <code>bubble_swaps(arr)</code>: how many swaps does bubble sort perform to sort <code>arr</code>? (Don't change the input.)</p>`,
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
  ]},
  { id: "merge", rev: 2, needs: ["sorting"], level: 3, title: "Merge Sort", blurb: "Divide and conquer", steps: [
    { type: "predict", probe: true, ask: "Before we start: what do you think this prints?", code: py`a, b = [1, 4, 7], [2, 3]
merged = []
while a and b:
    if a[0] <= b[0]:
        merged.append(a.pop(0))
    else:
        merged.append(b.pop(0))
print(merged, a, b)`, answer: "[1, 2, 3] [4, 7] []", explain: "Merging takes the smaller front item each time. When b runs out, whatever is left in a (4 and 7) is already in order and can simply be added at the end." },
    { type: "learn", title: "Split, sort, merge", html: py`
      <p><b>Divide and conquer</b>: split the list in half, sort each half recursively, then <b>merge</b> two sorted halves into one.</p>
      <pre><code>def merge_sort(a):
    if len(a) <= 1:
        return a
    mid = len(a) // 2
    return merge(merge_sort(a[:mid]), merge_sort(a[mid:]))</code></pre>
      <p>There are log₂ n levels of splitting and each level does O(n) merging work: <b>O(n log n)</b>, a big win over O(n²).</p>` },
    { type: "fill", prompt: py`<p>Fill in the heart of <code>merge</code>: compare the two front items and move the pointer of the list you took from.</p>`,
      template: py`def merge(a, b):
    i = j = 0
    out = []
    while i < len(a) and j < len(b):
        if a[i] ___ b[j]:
            out.append(a[i])
            i += 1
        else:
            out.append(b[j])
            j += ___
    out.extend(a[i:])
    out.extend(b[j:])
    return out
`, blanks: ["<=", "1"], hint: ["Take from a when its front item is the smaller (or equal).", "In the else branch you took from b, so advance j."],
      tests: py`assert merge([1, 4, 7], [2, 3, 9]) == [1, 2, 3, 4, 7, 9] and merge([], [1]) == [1] and merge([1], []) == [1] and merge([1, 1], [1]) == [1, 1, 1]`, explain: "Two pointers that only ever move forward make merging O(n)." },
    { type: "order", prompt: py`<p>Put <code>merge_sort</code> together: split in half, sort each half, merge. One line is a trap.</p>`,
      lines: ["def merge_sort(arr):", "    if len(arr) <= 1:", "        return list(arr)", "    mid = len(arr) // 2", "    return merge(merge_sort(arr[:mid]), merge_sort(arr[mid:]))"], distractors: ["return merge(arr[:mid], arr[mid:])"],
      hint: ["The base case comes first: a list of 0 or 1 items is already sorted.", "Then find the middle, and merge the two sorted halves."],
      tests: py`def merge(a, b):
    i = j = 0
    out = []
    while i < len(a) and j < len(b):
        if a[i] <= b[j]:
            out.append(a[i]); i += 1
        else:
            out.append(b[j]); j += 1
    return out + a[i:] + b[j:]
assert merge_sort([5, 2, 9, 1, 5, 6]) == [1, 2, 5, 5, 6, 9] and merge_sort([]) == [] and merge_sort([2, 1]) == [1, 2]`, explain: "Trust the recursion: assume the halves come back sorted, and only worry about merging them." },
    { type: "code", mode: "fix", prompt: py`<p><code>merge([1, 4, 7], [2, 3])</code> should give <code>[1, 2, 3, 4, 7]</code> but items go missing. Fix it.</p>`,
      starter: py`def merge(a, b):
    i = j = 0
    out = []
    while i < len(a) and j < len(b):
        if a[i] <= b[j]:
            out.append(a[i])
            i += 1
        else:
            out.append(b[j])
            j += 1
    return out

print(merge([1, 4, 7], [2, 3]))
`, solution: py`def merge(a, b):
    i = j = 0
    out = []
    while i < len(a) and j < len(b):
        if a[i] <= b[j]:
            out.append(a[i])
            i += 1
        else:
            out.append(b[j])
            j += 1
    out.extend(a[i:])
    out.extend(b[j:])
    return out

print(merge([1, 4, 7], [2, 3]))`, hint: ["Which items are missing, and what was left over when the loop stopped?", "The loop ends as soon as one list runs out. Add whatever remains of both."],
      tests: py`assert output.strip() == "[1, 2, 3, 4, 7]"
assert merge([1, 4, 7], [2, 3]) == [1, 2, 3, 4, 7] and merge([], [1]) == [1] and merge([1], []) == [1]`, explain: "When one list runs out, the other's leftovers are already sorted and just need appending." },
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
    { type: "code", boss: true, prompt: py`<p>Now write <code>merge_sort(arr)</code> (returns a new list). The tests sort 20,000 numbers, so it must be fast.</p>`,
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
  { id: "recursion", rev: 2, needs: ["functions"], level: 3, title: "Recursion", blurb: "Functions that call themselves", steps: [
    { type: "predict", probe: true, ask: "Before we start: what do you think this prints?", code: py`def countdown(n):
    if n == 0:
        print("liftoff")
        return
    print(n)
    countdown(n - 1)

countdown(2)`, answer: py`2
1
liftoff`, explain: "countdown(2) prints 2 and then calls countdown(1), which prints 1 and calls countdown(0). That one hits the base case and prints liftoff, and everything stops." },
    { type: "learn", title: "Solve smaller versions", html: py`
      <p>A <b>recursive</b> function solves a problem by solving a smaller copy of it. It needs:</p>
      <ol><li>a <b>base case</b> that stops the recursion</li><li>a <b>recursive case</b> that moves toward the base case</li></ol>
      <pre data-try><code>def countdown(n):
    if n == 0:          # base case
        print("liftoff!")
        return
    print(n)
    countdown(n - 1)    # smaller problem</code></pre>
      <p>Each call sits on the <b>call stack</b>. Too deep and Python raises <code>RecursionError</code>.</p>` },
    { type: "fill", prompt: py`<p>Add the numbers from <code>n</code> down to 1 recursively. <code>total(4)</code> should print <code>10</code>.</p>`,
      template: py`def total(n):
    if n == ___:
        return 0
    return n + total(n ___ 1)

print(total(4))
`, blanks: ["0", "-"], hint: ["The recursion has to stop somewhere. Which n needs no more work?", "Each call must make the problem smaller: n - 1."],
      tests: py`assert output.strip() == "10" and total(0) == 0 and total(100) == 5050`, explain: "A recursive function needs a base case (n == 0 here) and a step that moves toward it (n - 1)." },
    { type: "order", prompt: py`<p>Write <code>power_of_two(n)</code> recursively: <code>2**0</code> is 1, and each extra power doubles the previous one. One line is a trap.</p>`,
      lines: ["def power_of_two(n):", "    if n == 0:", "        return 1", "    return 2 * power_of_two(n - 1)"], distractors: ["return 2 * power_of_two(n)"],
      hint: ["The base case goes first.", "The recursive call must use a smaller n."],
      tests: py`assert power_of_two(0) == 1 and power_of_two(10) == 1024 and power_of_two(3) == 8`, explain: "The distractor calls itself with the same n and would never stop: always shrink the problem." },
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
    { type: "code", mode: "fix", prompt: py`<p><code>sum_to(3)</code> should print <code>6</code> (3 + 2 + 1) but crashes with a <code>RecursionError</code>. Fix it.</p>`,
      starter: py`def sum_to(n):
    if n == 0:
        return 0
    return n + sum_to(n + 1)

print(sum_to(3))
`, solution: py`def sum_to(n):
    if n == 0:
        return 0
    return n + sum_to(n - 1)

print(sum_to(3))`, hint: ["The base case is n == 0. Is n ever going to reach 0?", "Each call must move toward the base case: n should shrink."],
      tests: py`assert output.strip() == "6" and sum_to(0) == 0 and sum_to(10) == 55`, explain: "Recursion that doesn't move toward its base case runs until Python gives up with a RecursionError." },
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
    { type: "code", boss: true, prompt: py`<p><b>Challenge:</b> write <code>power(base, exp)</code> recursively with <b>O(log n)</b> depth by squaring: <code>x^10 = (x^5)²</code>. The test uses <code>exp = 5000</code>, which would blow the stack if you multiply one at a time.</p>`,
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
  ]},
  { id: "graphs", rev: 2, needs: ["queues", "trees"], level: 4, title: "Graphs & BFS", blurb: "Networks and shortest paths", steps: [
    { type: "predict", probe: true, ask: "Before we start: what do you think this prints?", code: py`graph = {"A": ["B", "C"], "B": ["D"], "C": [], "D": []}
print(graph["A"], len(graph["B"]))`, answer: "['B', 'C'] 1", explain: "An adjacency dict maps each node to the list of its neighbours. A connects to B and C, and B has one neighbour (D)." },
    { type: "learn", title: "Things and connections", html: py`
      <p>A <b>graph</b> is nodes connected by edges: maps, friendships, the web. In Python an <b>adjacency dict</b> is the easiest form:</p>
      <pre data-try><code>graph = {
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
    { type: "fill", prompt: py`<p>This is the BFS loop. It should print <code>A</code>, <code>B</code>, <code>C</code>, <code>D</code> on separate lines. Fill in the two missing calls.</p>`,
      template: py`from collections import deque

graph = {"A": ["B", "C"], "B": ["D"], "C": [], "D": []}
queue = deque(["A"])
seen = {"A"}
while queue:
    node = queue.___()
    print(node)
    for nxt in graph[node]:
        if nxt not in seen:
            seen.___(nxt)
            queue.append(nxt)
`, blanks: ["popleft", "add"], hint: ["BFS takes from the front of the queue.", "A set uses add, not append."],
      tests: py`assert output.split() == ["A", "B", "C", "D"]`, explain: "The queue holds nodes waiting their turn, and the seen set makes sure nobody is queued twice." },
    { type: "order", prompt: py`<p>Count how many nodes you can reach from <code>start</code>. One line is a trap.</p>`,
      lines: ["def reachable(graph, start):", "    seen = {start}", "    queue = [start]", "    while queue:", "        node = queue.pop(0)", "        for nxt in graph[node]:", "            if nxt not in seen:", "                seen.add(nxt)", "                queue.append(nxt)", "    return len(seen)"], distractors: ["            seen.add(node)"],
      hint: ["Start with the start node in both seen and the queue.", "Inside the loop: take a node, then look at each of its neighbours."],
      tests: py`g = {"A": ["B", "C"], "B": ["D"], "C": ["D"], "D": [], "Z": []}
assert reachable(g, "A") == 4 and reachable(g, "D") == 1 and reachable(g, "Z") == 1
assert reachable({1: [2], 2: [3], 3: [1]}, 1) == 3`, explain: "The seen set is what stops the search from going round in circles on a cycle." },
    { type: "code", mode: "fix", prompt: py`<p>This should turn a list of two-way roads into a graph, so B knows about A as well. Right now <code>B</code> only lists <code>C</code>. Fix <code>build</code>.</p>`,
      starter: py`def build(edges):
    graph = {}
    for a, b in edges:
        graph.setdefault(a, []).append(b)
    return graph

print(build([("A", "B"), ("B", "C")]))
`, solution: py`def build(edges):
    graph = {}
    for a, b in edges:
        graph.setdefault(a, []).append(b)
        graph.setdefault(b, []).append(a)
    return graph

print(build([("A", "B"), ("B", "C")]))`, hint: ["Look at the output: who knows about whom?", "A road works both ways, so add b to a's list and a to b's list."],
      tests: py`assert build([("A", "B"), ("B", "C")]) == {"A": ["B"], "B": ["A", "C"], "C": ["B"]}
assert build([]) == {}`, explain: "For an undirected graph every edge must be stored in both directions." },
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
    { type: "code", boss: true, prompt: py`<p>Write <code>shortest_path_length(graph, start, goal)</code>: the minimum number of edges from start to goal, or <code>-1</code> if unreachable.</p>`,
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
  { id: "autocomplete", kind: "project", needs: ["binary", "sorting"], level: 3, title: "Mini: Autocomplete", blurb: "Suggest words as you type, fast, with binary search", steps: [
    { type: "learn", title: "How search boxes suggest", html: py`
      <p>When you type "pyt" and a list pops up, the engine does not scan every word. If the dictionary is <b>sorted</b>, all words starting with "pyt" sit next to each other, and binary search jumps straight to the first one.</p>
      <pre data-try><code>words = sorted(["apple", "apply", "banana", "band", "bandit", "cherry"])
lo, hi = 0, len(words)
while lo < hi:
    mid = (lo + hi) // 2
    if words[mid] < "ban":
        lo = mid + 1
    else:
        hi = mid
print(lo, words[lo])</code></pre>
      <p><code>lo</code> now points to the first word that is <code>&gt;= "ban"</code>.</p>` },
    { type: "code", prompt: py`<p><b>Piece 1.</b> Write <code>first_at_least(words, prefix)</code>: with a sorted list, return the index of the first word that is <code>&gt;= prefix</code> (<code>len(words)</code> if none). Use binary search, not a loop over everything.</p>`,
      starter: py`def first_at_least(words, prefix):
    pass
`, solution: py`def first_at_least(words, prefix):
    lo, hi = 0, len(words)
    while lo < hi:
        mid = (lo + hi) // 2
        if words[mid] < prefix:
            lo = mid + 1
        else:
            hi = mid
    return lo`, hint: "If words[mid] < prefix the answer is to the right; otherwise mid could still be the answer, so hi = mid.",
      tests: py`w = ["apple", "apply", "banana", "band", "bandit", "cherry"]
assert first_at_least(w, "ban") == 2
assert first_at_least(w, "a") == 0
assert first_at_least(w, "zzz") == 6
assert first_at_least([], "x") == 0
big = [f"w{i:06d}" for i in range(100000)]
assert first_at_least(big, "w050000") == 50000
_, r = timed(first_at_least, big, "w099999")
assert r < 0.01, "binary search should take well under 10 ms"` },
    { type: "code", prompt: py`<p><b>Piece 2.</b> Write <code>suggest(words, prefix, limit=5)</code>: starting at <code>first_at_least</code>, collect up to <code>limit</code> words while they still start with the prefix. Matching is case-insensitive, the words list is already sorted and lowercase.</p>`,
      starter: py`def first_at_least(words, prefix):
    lo, hi = 0, len(words)
    while lo < hi:
        mid = (lo + hi) // 2
        if words[mid] < prefix:
            lo = mid + 1
        else:
            hi = mid
    return lo

def suggest(words, prefix, limit=5):
    pass
`, solution: py`def first_at_least(words, prefix):
    lo, hi = 0, len(words)
    while lo < hi:
        mid = (lo + hi) // 2
        if words[mid] < prefix:
            lo = mid + 1
        else:
            hi = mid
    return lo

def suggest(words, prefix, limit=5):
    prefix = prefix.lower()
    out = []
    i = first_at_least(words, prefix)
    while i < len(words) and words[i].startswith(prefix) and len(out) < limit:
        out.append(words[i])
        i += 1
    return out`, hint: "Walk forward from the start index and stop at the first word that no longer starts with the prefix.",
      tests: py`w = ["apple", "apply", "banana", "band", "bandit", "cherry"]
assert suggest(w, "ban") == ["banana", "band", "bandit"]
assert suggest(w, "BAN", limit=2) == ["banana", "band"]
assert suggest(w, "x") == []
assert suggest(w, "") == w[:5]` },
    { type: "quiz", q: "The dictionary grows from 10,000 to 10,000,000 words. Roughly how much slower does the binary-search step get?", options: ["1000 times slower", "About 2 times slower (log2: ~13 vs ~23 steps)", "Exactly the same", "10 times slower"], answer: 1, why: ["That would be a linear scan. Binary search halves the range each step.", null, "It does grow, just very slowly.", "That is far too pessimistic for a log curve."], explain: "1000x more data adds only about 10 extra halving steps. That is the magic of O(log n)." },
  ]},
  ]
},
{
  id: "eff", title: "Efficiency", desc: "Big-O, speed, memory and smart tricks", color: "navy",
  lessons: [
  { id: "bigo", rev: 2, needs: ["linear"], level: 3, title: "Big-O Intuition", blurb: "How code scales", steps: [
    { type: "predict", probe: true, ask: "Before we start: what do you think this prints?", code: py`n = 10
count = 0
for i in range(n):
    for j in range(n):
        count += 1
print(count)`, answer: "100", explain: "The inner loop runs n times for every one of the n rounds of the outer loop: n x n = 100. Nested loops multiply the work, which is why they get slow so fast." },
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
    { type: "predict", ask: "How many steps does this take?", code: py`n = 64
steps = 0
while n > 1:
    n //= 2
    steps += 1
print(steps)`, answer: "6", explain: "64 halves to 32, 16, 8, 4, 2, 1: six halvings. Doubling n would only add one more step. That is O(log n)." },
    { type: "code", prompt: py`<p>Write <code>count_ops(n)</code> that returns how many times the inner line runs in this code. Run it in your head for small n first, then notice how fast the number grows.</p><pre><code>for i in range(n):
    for j in range(i):
        count += 1</code></pre>`,
      starter: py`def count_ops(n):
    pass
`, solution: py`def count_ops(n):
    count = 0
    for i in range(n):
        for j in range(i):
            count += 1
    return count`, hint: ["Copy the nested loops into your function and add a counter.", "Return the counter after the loops.", "It's 0 + 1 + 2 + ... + (n - 1). Still about n * n / 2: O(n squared)."],
      tests: py`assert count_ops(0) == 0 and count_ops(1) == 0 and count_ops(4) == 6 and count_ops(10) == 45
assert count_ops(100) == 4950`, explain: "Half of n x n is still 'n squared': Big-O ignores constant factors like the one half." },
    { type: "quiz", q: "Which operation is O(1) on average?", options: ["Looking up a key in a dict", "Searching an unsorted list", "Sorting a list", "Printing every item"], answer: 0, why: [null, "Searching an unsorted list may need to check every item: O(n).", "Sorting has to look at every item: O(n log n).", "Doing something for every item is O(n)."], explain: "Hashing jumps straight to the slot, no matter how large the dict is." },
    { type: "quiz", q: "What is the time complexity?", code: py`def total(items):
    s = 0
    for x in items:
        s += x
    return s`, options: ["O(n)", "O(1)", "O(n²)", "O(log n)"], answer: 0, why: [null, "The loop does O(1) work per item, but it runs once per item. Total work grows with size.", "There's only one loop here, not two nested ones.", "log n needs the problem to be halved each step. Here we visit every item."], explain: "One pass over n items." },
    { type: "quiz", q: "Which of these grows the FASTEST as n gets large?", options: ["2ⁿ", "n²", "n log n", "n"], answer: 0, why: [null, "n² grows quickly, but doubling the work for every extra item (2ⁿ) overtakes it.", "n log n is only slightly above linear.", "n is the slowest-growing option in this list."], explain: "Exponential growth doubles with every extra item. Nothing else in the list comes close." },
    { type: "code", boss: true, prompt: py`<p><b>Boss challenge, no hints.</b> <code>sum_to(n)</code> should add the numbers 1 to n. Looping works for small n, but the tests ask for <code>n = 10**12</code>, which would take hours. Find a way that takes the same time for any n (there is a famous formula).</p>`,
      starter: py`def sum_to(n):
    pass
`, solution: py`def sum_to(n):
    return n * (n + 1) // 2`,
      tests: py`assert sum_to(1) == 1 and sum_to(10) == 55 and sum_to(100) == 5050 and sum_to(0) == 0
assert sum_to(10**12) == 500000000000500000000000` },
  ]},
  { id: "spot", rev: 2, needs: ["bigo"], level: 3, title: "Spot the Complexity", blurb: "Read code, predict speed", steps: [
    { type: "predict", probe: true, ask: "Before we start: what do you think this prints?", code: py`count = 0
for i in range(5):
    count += 1
for i in range(5):
    count += 1
print(count)`, answer: "10", explain: "Two loops one after the other add up: 5 + 5 = 10. They don't multiply. Sequential work adds, nested work multiplies." },
    { type: "learn", title: "Rules of thumb", html: py`
      <ul>
        <li><b>Sequential</b> steps add: O(n) + O(n) = O(n). Drop constants.</li>
        <li><b>Nested</b> loops multiply: n × n = O(n²).</li>
        <li><b>Halving</b> the problem each step gives O(log n).</li>
        <li>Keep the <b>dominant term</b>: O(n² + n) = O(n²).</li>
      </ul>
      <p>You can also measure! In the Playground, try <b>Run + Profile</b> to see real timings.</p>` },
    { type: "predict", ask: "How many times does count += 1 run?", code: py`count = 0
for i in range(4):
    for j in range(i):
        count += 1
print(count)`, answer: "6", explain: "The inner loop runs 0, 1, 2 and 3 times: 0 + 1 + 2 + 3 = 6. It is about half of 4 x 4, but still grows like n squared." },
    { type: "quiz", q: "What is the time complexity?", code: py`for a in items:
    for b in items:
        print(a, b)`, options: ["O(n²)", "O(n)", "O(2n)", "O(log n)"], answer: 0, why: [null, "The inner loop runs n times for EACH outer iteration, so the work multiplies.", "O(2n) would be two loops one after the other. These are nested, so they multiply.", "Nothing is being halved here, so it isn't logarithmic."], explain: "n iterations, each doing n more: n × n." },
    { type: "predict", ask: "How many steps does this loop take?", code: py`n = 1000
steps = 0
while n > 1:
    n //= 2
    steps += 1
print(steps)`, answer: "9", explain: "1000 halves down to 1 in only 9 steps. Even for a million it would be about 20. That is what O(log n) looks like." },
    { type: "quiz", q: "What is the time complexity?", code: py`for x in items:
    print(x)
for x in items:
    print(x * 2)`, options: ["O(n)", "O(n²)", "O(2ⁿ)", "O(log n)"], answer: 0, why: [null, "The loops are sequential, not nested. Sequential work adds up, it doesn't multiply.", "Exponential needs branching recursion, not two plain loops.", "Each loop visits every item, so it can't be logarithmic."], explain: "Two separate passes: 2n, and constants are dropped." },
    { type: "code", mode: "fix", prompt: py`<p>This <code>has_duplicates</code> gives the right answers but is far too slow on big lists (it checks <code>x in seen</code> on a <i>list</i>, which scans it every time). Make it fast: the tests use 20,000 items.</p>`,
      starter: py`def has_duplicates(items):
    seen = []
    for x in items:
        if x in seen:
            return True
        seen.append(x)
    return False
`, solution: py`def has_duplicates(items):
    seen = set()
    for x in items:
        if x in seen:
            return True
        seen.add(x)
    return False`, hint: ["Which part of this function gets slower the bigger seen grows?", "Checking membership in a list is O(n). Is there a collection where it is O(1)?", "Use a set: seen = set() and seen.add(x)."],
      tests: py`assert has_duplicates([1, 2, 3, 1]) is True and has_duplicates([]) is False and has_duplicates(["a", "b"]) is False
big = list(range(20000))
r, t = timed(has_duplicates, big)
assert r is False
assert t < 0.2, f"Took {t:.2f}s. Aim for O(n)."
big.append(5)
assert has_duplicates(big) is True`, explain: "Swapping a list for a set turned an O(n squared) function into an O(n) one." },
    { type: "code", boss: true, prompt: py`<p><b>Boss challenge, no hints.</b> Write <code>common(a, b)</code> returning the sorted list of values that appear in both lists (each value once). The tests use two lists of 50,000 numbers, so comparing every pair is out of the question.</p>`,
      starter: py`def common(a, b):
    pass
`, solution: py`def common(a, b):
    return sorted(set(a) & set(b))`,
      tests: py`assert common([1, 2, 2, 3], [2, 3, 4]) == [2, 3] and common([], [1]) == [] and common([1], [2]) == []
a = list(range(0, 100000, 2))
b = list(range(0, 100000, 3))
r, t = timed(common, a, b)
assert r == list(range(0, 100000, 6))
assert t < 0.3, f"Took {t:.2f}s. Aim for roughly O(n)."` },
    { type: "quiz", q: "What is the time complexity?", code: py`while n > 1:
    n //= 2`, options: ["O(log n)", "O(n)", "O(n²)", "O(1)"], answer: 0, why: [null, "n isn't reduced step by step. It's halved, which is much faster than counting down.", "There's no loop inside a loop, so it can't be quadratic.", "The loop runs more times as n grows, so it isn't constant."], explain: "n is halved each time, so it takes log₂ n steps to reach 1." },
  ]},
  { id: "twosum", rev: 2, needs: ["hashing", "spot"], level: 3, title: "Trade Space for Time", blurb: "Use extra memory to go faster", steps: [
    { type: "predict", probe: true, ask: "Before we start: what do you think this prints?", code: py`nums = [2, 7, 11]
seen = {}
for i, x in enumerate(nums):
    print(9 - x in seen)
    seen[x] = i`, answer: py`False
True
False`, explain: "For each number it asks: have I already seen the partner that makes 9? For 2 the partner 7 is unseen. For 7 the partner 2 was seen (True). 11's partner would be -2, never seen." },
    { type: "learn", title: "Remember what you've seen", html: py`
      <p>Often you can turn O(n²) into O(n) by spending a little memory, usually a dict or set.</p>
      <p><b>Two Sum</b>: find two numbers adding to <code>target</code>. Brute force tries every pair: O(n²). Instead, for each number ask: <i>have I already seen <code>target - x</code>?</i></p>
      <pre><code>seen = {}                    # value -> index
for i, x in enumerate(nums):
    if target - x in seen:
        return seen[target - x], i
    seen[x] = i</code></pre>` },
    { type: "fill", prompt: py`<p>Complete the one-pass Two Sum: look for the partner in the dict of values seen so far, and remember each value as you go.</p>`,
      template: py`def two_sum(nums, target):
    seen = {}
    for i, x in enumerate(nums):
        if target - x in ___:
            return (seen[target - x], i)
        seen[___] = i
    return None
`, blanks: ["seen", "x"], hint: ["The partner you want is one of the earlier numbers. Where are those stored?", "After checking, remember the current number x with its position."],
      tests: py`assert two_sum([2, 7, 11, 15], 9) == (0, 1) and two_sum([3, 2, 4], 6) == (1, 2) and two_sum([1, 2], 10) is None`, explain: "Each number is looked at once and the dict answers 'seen the partner?' instantly: O(n) time for O(n) memory." },
    { type: "order", prompt: py`<p>Count the pairs of numbers (earlier, later) that add up to <code>target</code>, in a single pass. One line is a trap.</p>`,
      lines: ["def count_pairs(nums, target):", "    seen = {}", "    pairs = 0", "    for x in nums:", "        pairs += seen.get(target - x, 0)", "        seen[x] = seen.get(x, 0) + 1", "    return pairs"], distractors: ["        pairs += seen[target - x]"],
      hint: ["Set up the dict and the counter, then loop.", "First count the partners already seen, then remember x."],
      tests: py`assert count_pairs([1, 5, 5, 1], 6) == 4 and count_pairs([2, 2, 2], 4) == 3 and count_pairs([], 3) == 0 and count_pairs([1, 2], 10) == 0`, explain: "Counting partners before recording x guarantees you never pair a number with itself." },
    { type: "code", mode: "fix", prompt: py`<p><code>has_pair(nums, target)</code> should say whether two <b>different</b> items add up to the target. For <code>[5]</code> and target <code>10</code> it wrongly says <code>True</code> (5 + 5, the same item twice). Fix it.</p>`,
      starter: py`def has_pair(nums, target):
    seen = set()
    for x in nums:
        seen.add(x)
        if target - x in seen:
            return True
    return False

print(has_pair([5], 10))
`, solution: py`def has_pair(nums, target):
    seen = set()
    for x in nums:
        if target - x in seen:
            return True
        seen.add(x)
    return False

print(has_pair([5], 10))`, hint: ["Which number is the 'partner' for 5? Is it already in seen?", "The loop adds x to seen before it looks for the partner, so x can match itself. Swap the two steps."],
      tests: py`assert output.strip() == "False"
assert has_pair([5], 10) is False and has_pair([5, 5], 10) is True and has_pair([3, 7], 10) is True and has_pair([], 1) is False`, explain: "Look for the partner among the earlier items first, and only then record the current one." },
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
    { type: "code", boss: true, prompt: py`<p>Write <code>max_subarray(nums)</code>: the largest sum of any contiguous slice (Kadane's algorithm, O(n)). For <code>[-2,1,-3,4,-1,2,1,-5,4]</code> that's <code>6</code>.</p>`,
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
  { id: "memo", rev: 2, needs: ["recursion", "bigo"], level: 4, title: "Memoization", blurb: "Never solve the same thing twice", steps: [
    { type: "predict", probe: true, ask: "Before we start: what do you think this prints?", code: py`cache = {}

def square(n):
    if n not in cache:
        print("computing", n)
        cache[n] = n * n
    return cache[n]

print(square(4))
print(square(4))`, answer: py`computing 4
16
16`, explain: "The first call has to compute 4 and stores the result. The second call finds it in the cache and skips the work entirely. That is memoization." },
    { type: "learn", title: "Cache your answers", html: py`
      <p>Naive recursive Fibonacci recomputes the same values again and again: <code>fib(40)</code> makes over 300 million calls!</p>
      <pre data-try><code>def fib(n):
    if n < 2: return n
    return fib(n - 1) + fib(n - 2)    # O(2ⁿ)

print(fib(5))</code></pre>
      <p><b>Memoization</b> stores results in a dict so each subproblem is solved once: O(n). Python can even do it for you with <code>functools.cache</code>.</p>
      <pre data-try><code>from functools import cache

@cache
def fib(n):
    return n if n < 2 else fib(n - 1) + fib(n - 2)

print(fib(30))</code></pre>` },
    { type: "fill", prompt: py`<p>Fix the speed of Fibonacci with a dict cache. Each answer is stored the first time and reused after that.</p>`,
      template: py`cache = {}

def fib(n):
    if n < 2:
        return n
    if n not in cache:
        cache[n] = fib(n - 1) + fib(___)
    return cache[___]
`, blanks: ["n - 2", "n"], hint: ["Fibonacci adds the two previous values.", "The second blank returns the value you just stored for n."],
      tests: py`assert fib(0) == 0 and fib(1) == 1 and fib(10) == 55
r, t = timed(fib, 90)
assert r == 2880067194370816120 and t < 0.5`, explain: "With the cache each fib(k) is computed once, so the work drops from exponential to linear." },
    { type: "order", prompt: py`<p>Count the ways to climb <code>n</code> stairs taking 1 or 2 steps at a time, using Python's built-in cache. One line is a trap.</p>`,
      lines: ["from functools import cache", "@cache", "def stairs(n):", "    if n <= 1:", "        return 1", "    return stairs(n - 1) + stairs(n - 2)"], distractors: ["        return stairs(n)"],
      hint: ["The import must come before the decorator that uses it.", "@cache goes directly above the def line."],
      tests: py`assert stairs(1) == 1 and stairs(4) == 5 and stairs(10) == 89
r, t = timed(stairs, 80)
assert r == 37889062373143906 and t < 0.5`, explain: "@cache gives you memoization for free: same arguments, same answer, computed once." },
    { type: "predict", code: py`calls = 0

def fib(n):
    global calls
    calls += 1
    return n if n < 2 else fib(n - 1) + fib(n - 2)

print(fib(4), calls)`,
      answer: py`3 9` },
    { type: "code", mode: "fix", prompt: py`<p>This <code>fib</code> has a cache, but it is still painfully slow. Find out why and fix it.</p>`,
      starter: py`cache = {}

def fib(n):
    if n in cache:
        return cache[n]
    if n < 2:
        return n
    return fib(n - 1) + fib(n - 2)

print(fib(25))
`, solution: py`cache = {}

def fib(n):
    if n in cache:
        return cache[n]
    if n < 2:
        return n
    cache[n] = fib(n - 1) + fib(n - 2)
    return cache[n]

print(fib(25))`, hint: ["Does anything ever put a value into the cache?", "The cache is only read, never written. Store the result before returning it."],
      tests: py`cache.clear()
r, t = timed(fib, 32)
assert t < 0.05, f"Took {t:.2f}s: results aren't being cached"
assert fib(10) == 55 and fib(90) == 2880067194370816120`, explain: "A cache that is never filled is just extra code. Store each result as soon as you have computed it." },
    { type: "quiz", q: "Roughly how many calls does naive recursive fib(40) make?", options: ["Over 300 million", "40", "About 800", "80"], answer: 0, why: [null, "40 calls would be one call per value, which is exactly what memoization gives you. Plain recursion does far more.", "The calls roughly double with each level, which grows much faster than 800.", "Without caching, the same fib values are recomputed again and again, so it's far more than 80."], explain: "The call tree nearly doubles at each level. That's why caching helps so much." },
    { type: "code", prompt: py`<p>A frog can jump 1, 2 or 3 steps at a time. Write <code>ways(n)</code>: how many different jump sequences reach step <code>n</code>? <code>ways(4)</code> is <code>7</code>. The test uses <code>n = 40</code>, so cache your results.</p>`,
      starter: py`def ways(n):
    pass
`, solution: py`from functools import cache

@cache
def ways(n):
    if n < 0:
        return 0
    if n == 0:
        return 1
    return ways(n - 1) + ways(n - 2) + ways(n - 3)`, hint: ["The last jump was 1, 2 or 3 steps, so add three smaller answers.", "ways(0) is 1 (stay put) and a negative step is impossible.", "ways(n) = ways(n-1) + ways(n-2) + ways(n-3), with @cache on top."],
      tests: py`assert ways(0) == 1 and ways(1) == 1 and ways(3) == 4 and ways(4) == 7
r, t = timed(ways, 40)
assert r == 23837527729 and t < 0.5, "Too slow? Cache the results."` },
    { type: "code", boss: true, prompt: py`<p>A robot on a <code>rows × cols</code> grid moves only right or down. Write <code>count_paths(rows, cols)</code>: how many different paths lead from the top-left to the bottom-right? Without caching, <code>(18, 18)</code> takes forever.</p>`,
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
  ]},
  { id: "space", rev: 2, needs: ["memo", "spot"], level: 4, title: "Memory & Generators", blurb: "Do more with less space", steps: [
    { type: "predict", probe: true, ask: "Before we start: what do you think this prints?", code: py`def count_up(n):
    for i in range(n):
        yield i

gen = count_up(3)
print(next(gen), next(gen))`, answer: "0 1", explain: "A generator doesn't run all at once. Each next() resumes it until the next yield, hands back one value and pauses, so values appear one at a time." },
    { type: "learn", title: "Space complexity", html: py`
      <p>Speed isn't the only cost. <b>Space complexity</b> measures extra memory. Two tools for saving it:</p>
      <ul>
        <li><b>In-place</b> algorithms modify the input instead of copying it: O(1) extra space.</li>
        <li><b>Generators</b> produce values one at a time with <code>yield</code> instead of building a whole list.</li>
      </ul>
      <pre data-try><code>def count_up(n):
    for i in range(n):
        yield i          # lazy: one value at a time

for n in count_up(3):
    print(n)

sum(x * x for x in range(10**7))   # no giant list in memory</code></pre>
      <p>Try the Playground's <b>Run + Profile</b> to see peak memory.</p>` },
    { type: "fill", prompt: py`<p>Turn this function into a generator that produces the squares one at a time. It should print <code>[0, 1, 4, 9]</code>.</p>`,
      template: py`def squares(n):
    for i in ___(n):
        ___ i * i

print(list(squares(4)))
`, blanks: ["range", "yield"], hint: ["Count from 0 up to n - 1.", "A generator hands out values with yield instead of return."],
      tests: py`import types
assert output.strip() == "[0, 1, 4, 9]" and isinstance(squares(3), types.GeneratorType)`, explain: "yield pauses the function and hands out one value. The next value is only computed when someone asks for it." },
    { type: "order", prompt: py`<p>Reverse a list <b>in place</b> with two pointers, using no extra list. One line is a trap.</p>`,
      lines: ["def reverse_in_place(lst):", "    i, j = 0, len(lst) - 1", "    while i < j:", "        lst[i], lst[j] = lst[j], lst[i]", "        i += 1", "        j -= 1"], distractors: ["        lst.append(lst[i])"],
      hint: ["Put one pointer at each end of the list.", "Swap, then move the pointers toward each other until they meet."],
      tests: py`assert "[::-1]" not in source and "reversed(" not in source and ".reverse(" not in source, "Do the swaps yourself"
a = [1, 2, 3, 4, 5]
ref = a
assert reverse_in_place(a) is None
assert a == [5, 4, 3, 2, 1] and a is ref
b = [1, 2]
reverse_in_place(b)
assert b == [2, 1]
c = []
reverse_in_place(c)
assert c == []`, explain: "Two pointers swapping toward the middle need only O(1) extra space, because nothing new is built." },
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
    { type: "code", mode: "fix", prompt: py`<p>The total of the squares should print <code>5</code> <b>twice</b>, but the second line prints <code>0</code>. Fix it, keeping the two <code>print</code> lines.</p>`,
      starter: py`squares = (x * x for x in range(3))
print(sum(squares))
print(sum(squares))
`, solution: py`squares = [x * x for x in range(3)]
print(sum(squares))
print(sum(squares))`, hint: ["The first sum used the generator up.", "A generator can be consumed only once. When you need the values twice, keep them in a list."],
      tests: py`assert output.split() == ["5", "5"]`, explain: "Generators save memory by not remembering their values, so once they have been read they are empty." },
    { type: "quiz", q: "Which uses O(1) extra memory?", options: ["sum(x * x for x in range(10**7))", "sum([x * x for x in range(10**7)])", "Both use O(1)", "Neither can run"], answer: 0, why: [null, "The square brackets build a list of ten million squares first.", "Only the generator avoids building that list.", "Both run. One just needs a lot of memory."], explain: "The generator yields one value at a time. The list comprehension builds all ten million first." },
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
    { type: "code", boss: true, prompt: py`<p><b>Boss challenge, no hints.</b> Write a <b>generator</b> <code>chunks(lst, size)</code> that yields successive pieces of the list, each at most <code>size</code> long. <code>list(chunks([1, 2, 3, 4, 5], 2))</code> is <code>[[1, 2], [3, 4], [5]]</code>.</p>`,
      starter: py`def chunks(lst, size):
    pass
`, solution: py`def chunks(lst, size):
    for start in range(0, len(lst), size):
        yield lst[start:start + size]`,
      tests: py`import types
g = chunks([1, 2, 3], 2)
assert isinstance(g, types.GeneratorType), "use yield"
assert list(chunks([1, 2, 3, 4, 5], 2)) == [[1, 2], [3, 4], [5]]
assert list(chunks([], 3)) == [] and list(chunks([1, 2], 5)) == [[1, 2]]
assert sum(len(c) for c in chunks(list(range(100000)), 7)) == 100000` },
  ]},
  ]
},
{
  id: "depth", title: "Python in Depth & OOP", desc: "Strings, errors, modules, classes, inheritance and testing", color: "purple",
  lessons: [
  { id: "strings", rev: 2, needs: ["loops", "lists"], level: 2, title: "Working with Strings", blurb: "Slice, search, split and clean text", steps: [
    { type: "predict", probe: true, ask: "Before we start: what do you think this prints?", code: py`word = "python"
print(word[0], word[-1], word[1:4])
print(word.upper())`, answer: py`p n yth
PYTHON`, explain: "A string is a row of characters: word[0] is the first, word[-1] the last, and [1:4] takes positions 1, 2 and 3. upper() gives back an upper-case copy." },
    { type: "learn", title: "Strings are sequences of characters", html: py`
      <p>A string works like a list of characters: you can index, slice and loop over it. But strings are <b>immutable</b>: methods never change the original, they return a <b>new</b> string.</p>
      <pre data-try><code>s = "  Hello, World  "
clean = s.strip()
print(clean.lower())
print(clean[0], clean[-1], clean[:5])
print("a-b-c".split("-"))
print("-".join(["x", "y", "z"]))
print("python".startswith("py"), "thon" in "python")
print(s)            # unchanged</code></pre>
      <p><code>split</code> turns text into a list, <code>join</code> turns a list back into text. Together they handle most text cleanup.</p>` },
    { type: "fill", prompt: py`<p>Clean up the text: remove the spaces around it and make it lower case. It should print <code>hello, world</code>.</p>`,
      template: py`text = "  Hello, World  "
clean = text.___()
print(clean.___())
`, blanks: ["strip", "lower"], hint: ["One method removes whitespace from both ends.", "strip() removes spaces; lower() makes everything lower case."],
      tests: py`assert output.strip() == "hello, world"`, explain: "Methods can be chained step by step: clean the edges first, then change the case." },
    { type: "order", prompt: py`<p>Build <code>initials(name)</code>: <code>"ada lovelace"</code> becomes <code>"AL"</code>. One line is a trap.</p>`,
      lines: ["def initials(name):", "    result = \"\"", "    for word in name.split():", "        result += word[0].upper()", "    return result"], distractors: ["        result += word[-1]"],
      hint: ["Start with an empty string, loop over the words, return at the end.", "The letter you want from each word is its first one."],
      tests: py`assert initials("ada lovelace") == "AL" and initials("grace brewster hopper") == "GBH" and initials("") == ""`, explain: "split() turns text into words, then you only need the first character of each." },
    { type: "predict", code: py`s = "banana"
print(s.count("an"))
print(s.find("n"))
print(s[1:4])
print(s.replace("a", "o", 2))`,
      answer: py`2
2
ana
bonona` },
    { type: "code", mode: "fix", prompt: py`<p>This should print <code>Ada</code> but prints <code>ada</code>. Fix it.</p>`,
      starter: py`name = "ada"
name.capitalize()
print(name)
`, solution: py`name = "ada"
name = name.capitalize()
print(name)
`, hint: ["The method ran. So where did its result go?", "Strings can't be changed: capitalize() returns a new string. Keep it by assigning it back."],
      tests: py`assert output.strip() == "Ada"`, explain: "String methods never change the original. They return a new string, so you must store it." },
    { type: "code", prompt: py`<p>Write <code>title_case(text)</code>: capitalise the first letter of every word, lower-case the rest, and squeeze any extra spaces so words are separated by exactly one space (no spaces at the ends).</p>`,
      starter: py`def title_case(text):
    pass
`, solution: py`def title_case(text):
    return " ".join(word.capitalize() for word in text.split())`, hint: "text.split() with no argument splits on any run of spaces. Then capitalize each word and join with one space.",
      tests: py`assert title_case("hello world") == "Hello World"
assert title_case("  the   QUICK brown  fox ") == "The Quick Brown Fox"
assert title_case("") == ""
assert title_case("python") == "Python"` },
    { type: "code", boss: true, prompt: py`<p>Write <code>is_palindrome(text)</code>. It is <code>True</code> when the text reads the same forwards and backwards, ignoring upper/lower case and anything that is not a letter or digit. <code>"A man, a plan, a canal: Panama"</code> is a palindrome.</p>`,
      starter: py`def is_palindrome(text):
    pass
`, solution: py`def is_palindrome(text):
    chars = [c.lower() for c in text if c.isalnum()]
    return chars == chars[::-1]`, hint: "Keep only the characters where c.isalnum() is true, lower-case them, then compare the list with its reverse.",
      tests: py`assert is_palindrome("A man, a plan, a canal: Panama") is True
assert is_palindrome("racecar") is True
assert is_palindrome("hello") is False
assert is_palindrome("") is True
assert is_palindrome("No 'x' in Nixon") is True` },
  ]},
  { id: "tuples", rev: 2, needs: ["lists"], level: 2, title: "Tuples & Unpacking", blurb: "Fixed groups of values and multiple returns", steps: [
    { type: "predict", probe: true, ask: "Before we start: what do you think this prints?", code: py`point = (3, 4)
x, y = point
print(y, x)`, answer: "4 3", explain: "Unpacking hands out the tuple's items in order: x gets 3 and y gets 4. Printing y first gives 4 3." },
    { type: "learn", title: "Tuples group values that belong together", html: py`
      <p>A <b>tuple</b> is like a list that cannot change. Use one for a small, fixed group such as a point <code>(x, y)</code> or a name with an age. <b>Unpacking</b> splits a tuple into variables in one line.</p>
      <pre data-try><code>point = (3, 4)
x, y = point
print(x, y)

x, y = y, x            # swap without a temp variable
print(x, y)

first, *rest = [10, 20, 30, 40]
print(first, rest)

def min_max(nums):
    return min(nums), max(nums)    # returns one tuple

low, high = min_max([5, 2, 9])
print(low, high)

for i, name in enumerate(["a", "b"]):
    print(i, name)</code></pre>
      <p>Because tuples are immutable they can be dict keys, and a list cannot.</p>` },
    { type: "fill", prompt: py`<p>Swap the two values without a temporary variable. It should print <code>2 1</code>.</p>`,
      template: py`a, b = 1, 2
a, b = ___, ___
print(a, b)
`, blanks: ["b", "a"], hint: ["The right side is built first, as a tuple, and then unpacked.", "To swap, put the old b first and the old a second."],
      tests: py`assert output.strip() == "2 1"`, explain: "The right-hand side is evaluated completely before anything is assigned, which makes the swap safe." },
    { type: "order", prompt: py`<p>Write <code>divide(a, b)</code> that returns <b>both</b> the quotient and the remainder. One line is a trap.</p>`,
      lines: ["def divide(a, b):", "    quotient = a // b", "    remainder = a % b", "    return quotient, remainder"], distractors: ["return quotient remainder"],
      hint: ["Work out the two values before returning them.", "A comma between two values makes a tuple."],
      tests: py`assert divide(17, 5) == (3, 2) and divide(10, 2) == (5, 0) and isinstance(divide(1, 1), tuple)`, explain: "Returning several values is just returning one tuple." },
    { type: "predict", code: py`a, *rest = [1, 2, 3, 4]
print(a)
print(rest)
x, y = 1, 2
x, y = y, x + y
print(x, y)`,
      answer: py`1
[2, 3, 4]
2 3` },
    { type: "code", mode: "fix", prompt: py`<p>This crashes. Make it print <code>(10, 2)</code> by changing the first value of the point.</p>`,
      starter: py`point = (1, 2)
point[0] = 10
print(point)
`, solution: py`point = (1, 2)
point = (10, point[1])
print(point)
`, hint: ["Read the error: what is not allowed on a tuple?", "Tuples can't be changed in place. Build a new tuple instead and replace the old one."],
      tests: py`assert output.strip() == "(10, 2)"`, explain: "Tuples are immutable, so 'changing' one means making a new one." },
    { type: "quiz", q: "Which of these is a tuple with exactly one item?", options: ["(5,)", "(5)", "[5]", "{5}"], answer: 0, why: [null, "Parentheses alone just group a value. (5) is the plain number 5.", "Square brackets make a list.", "Curly braces make a set."], explain: "The trailing comma is what makes a tuple. (5,) is a one-item tuple." },
    { type: "code", prompt: py`<p>Write <code>min_max(nums)</code> returning a tuple <code>(smallest, largest)</code>. For an empty list return <code>(None, None)</code>.</p>`,
      starter: py`def min_max(nums):
    pass
`, solution: py`def min_max(nums):
    if not nums:
        return None, None
    return min(nums), max(nums)`, hint: "Return two values separated by a comma; Python packs them into a tuple.",
      tests: py`assert min_max([3, 1, 2]) == (1, 3)
assert min_max([7]) == (7, 7)
assert min_max([]) == (None, None)
assert isinstance(min_max([1, 2]), tuple)` },
    { type: "code", boss: true, prompt: py`<p>Write <code>unzip(pairs)</code>. Given a list of <code>(a, b)</code> tuples, return two lists: all the a's and all the b's. <code>[(1, "x"), (2, "y")]</code> gives <code>([1, 2], ["x", "y"])</code>.</p>`,
      starter: py`def unzip(pairs):
    pass
`, solution: py`def unzip(pairs):
    firsts = []
    seconds = []
    for a, b in pairs:
        firsts.append(a)
        seconds.append(b)
    return firsts, seconds`, hint: "Unpack each pair in the for line: for a, b in pairs.",
      tests: py`assert unzip([(1, "x"), (2, "y")]) == ([1, 2], ["x", "y"])
assert unzip([]) == ([], [])
assert unzip([(5, 6)]) == ([5], [6])` },
  ]},
  { id: "errors", rev: 2, needs: ["functions", "dicts"], level: 2, title: "Errors & Exceptions", blurb: "Handle failures instead of crashing", steps: [
    { type: "predict", probe: true, ask: "Before we start: what do you think this prints?", code: py`try:
    print(int("42"))
    print(int("abc"))
    print("done")
except ValueError:
    print("bad number")`, answer: py`42
bad number`, explain: "The first int() works and prints 42. The second raises ValueError, so Python jumps straight to the except block: the line that prints done never runs." },
    { type: "learn", title: "Catch what you expect, raise what is wrong", html: py`
      <p>When something goes wrong Python <b>raises an exception</b> and stops. A <code>try</code>/<code>except</code> block lets you handle the failure and carry on. You can also <code>raise</code> your own errors to reject bad input.</p>
      <pre data-try><code>def parse(text):
    try:
        return int(text)
    except ValueError:
        return None
    finally:
        print("parsed", text)

print(parse("42"))
print(parse("abc"))

def set_age(age):
    if age < 0:
        raise ValueError("age cannot be negative")
    return age

try:
    set_age(-5)
except ValueError as e:
    print("rejected:", e)</code></pre>
      <p>Catch <b>specific</b> exceptions (ValueError, KeyError, ZeroDivisionError). A bare <code>except:</code> hides real bugs. <code>finally</code> always runs, which is where cleanup goes.</p>` },
    { type: "fill", prompt: py`<p>Catch the error so the program prints <code>0</code> instead of crashing.</p>`,
      template: py`try:
    age = int("abc")
___ ___:
    age = 0
print(age)
`, blanks: ["except", "ValueError"], hint: ["The block that handles a failure starts with a special keyword.", "except ValueError: catches the error that int(\"abc\") raises."],
      tests: py`assert output.strip() == "0"`, explain: "Catch the specific exception you expect, not every possible one." },
    { type: "order", prompt: py`<p>Write <code>safe_div(a, b)</code> that returns <code>None</code> instead of crashing when <code>b</code> is zero. One line is a trap.</p>`,
      lines: ["def safe_div(a, b):", "    try:", "        return a / b", "    except ZeroDivisionError:", "        return None"], distractors: ["    except:"],
      hint: ["The risky line goes inside try.", "except names the error it handles."],
      tests: py`assert safe_div(6, 3) == 2 and safe_div(1, 0) is None and safe_div(0, 5) == 0`, explain: "A bare 'except:' would also hide typos and real bugs. Name the exception you expect." },
    { type: "predict", code: py`def f(x):
    try:
        return 10 / x
    except ZeroDivisionError:
        return "inf"
    finally:
        print("done")

print(f(2))
print(f(0))`,
      answer: py`done
5.0
done
inf` },
    { type: "code", mode: "fix", prompt: py`<p>This should print <code>None</code> for bad input but it crashes anyway. The handler is catching the wrong kind of error. Fix it.</p>`,
      starter: py`def parse(text):
    try:
        return int(text)
    except KeyError:
        return None

print(parse("abc"))
`, solution: py`def parse(text):
    try:
        return int(text)
    except ValueError:
        return None

print(parse("abc"))
`, hint: ["Read the error name at the end of the crash.", "int(\"abc\") raises ValueError, but the code only handles KeyError."],
      tests: py`assert output.strip() == "None" and parse("12") == 12 and parse("x") is None`, explain: "An except only catches the exception types it names, so it has to match what is actually raised." },
    { type: "quiz", q: "Which exception does int(\"abc\") raise?", options: ["ValueError", "TypeError", "KeyError", "SyntaxError"], answer: 0, why: [null, "TypeError is for the wrong kind of value, such as int([]). Here the type (a string) is fine but its content is not a number.", "KeyError is for missing dict keys.", "SyntaxError happens while reading the code, before it runs."], explain: "The argument is a string, which is allowed, but its content cannot be turned into an int: ValueError." },
    { type: "code", prompt: py`<p>Write <code>safe_int(text, default=0)</code> returning <code>int(text)</code>, or <code>default</code> when the text is not a whole number.</p>`,
      starter: py`def safe_int(text, default=0):
    pass
`, solution: py`def safe_int(text, default=0):
    try:
        return int(text)
    except ValueError:
        return default`, hint: "Put int(text) in a try block and catch ValueError.",
      tests: py`assert safe_int("42") == 42
assert safe_int("abc") == 0
assert safe_int("3.5", default=-1) == -1
assert safe_int(" 7 ") == 7
assert safe_int("", 9) == 9` },
    { type: "code", boss: true, prompt: py`<p>Write <code>parse_age(text)</code>. Return the age as an <code>int</code>. If it is not a number, or is outside 0 to 150, raise <code>ValueError</code> with a clear message.</p>`,
      starter: py`def parse_age(text):
    pass
`, solution: py`def parse_age(text):
    age = int(text)
    if not 0 <= age <= 150:
        raise ValueError(f"age out of range: {age}")
    return age`, hint: "int(text) already raises ValueError for non-numbers. Add your own raise for the range check.",
      tests: py`assert parse_age("30") == 30
assert parse_age("0") == 0 and parse_age("150") == 150
for bad in ("abc", "-1", "151", ""):
    try:
        parse_age(bad)
    except ValueError:
        pass
    else:
        raise AssertionError(f"{bad!r} should raise ValueError")` },
  ]},
  { id: "modules", rev: 2, needs: ["functions", "dicts"], level: 2, title: "Modules & the Standard Library", blurb: "Use code other people already wrote", steps: [
    { type: "predict", probe: true, ask: "Before we start: what do you think this prints?", code: py`import math
print(math.sqrt(16), math.floor(2.7))`, answer: "4.0 2", explain: "import math gives you ready-made tools. sqrt always returns a decimal number (4.0) and floor rounds down to a whole number (2)." },
    { type: "learn", title: "Batteries included", html: py`
      <p>A <b>module</b> is a file of ready-made code. <code>import</code> it and use what is inside. Python's <b>standard library</b> ships with hundreds, so check there before writing your own.</p>
      <pre data-try><code>import math
from collections import Counter, defaultdict

print(math.sqrt(16), math.floor(2.7), math.pi)

counts = Counter("hello world")
print(counts["l"], counts.most_common(2))

groups = defaultdict(list)       # missing keys start as []
for word in ["apple", "avocado", "banana"]:
    groups[word[0]].append(word)
print(dict(groups))</code></pre>
      <p>Useful ones to know: <code>math</code>, <code>random</code>, <code>collections</code>, <code>itertools</code>, <code>datetime</code>, <code>json</code>, <code>re</code>.</p>` },
    { type: "fill", prompt: py`<p>Count the letters of <code>"hello"</code> with <code>Counter</code> and print the most common one as a list: <code>[('l', 2)]</code>.</p>`,
      template: py`from collections import ___
counts = Counter("hello")
print(counts.___(1))
`, blanks: ["Counter", "most_common"], hint: ["The name you import has to match the one you use on the next line.", "Counter has a method that lists the top items by count."],
      tests: py`assert output.strip() == "[('l', 2)]"`, explain: "Counter is a dict built for counting, with handy extras like most_common." },
    { type: "order", prompt: py`<p>Write <code>by_first_letter(words)</code> that groups words by their first letter using <code>defaultdict</code>. One line is a trap.</p>`,
      lines: ["def by_first_letter(words):", "    from collections import defaultdict", "    groups = defaultdict(list)", "    for w in words:", "        groups[w[0]].append(w)", "    return dict(groups)"], distractors: ["        groups[w[0]] = w"],
      hint: ["Import before you use the tool, and create the container before the loop.", "The loop fills groups, and the function ends by returning it."],
      tests: py`assert by_first_letter(["apple", "avocado", "banana"]) == {"a": ["apple", "avocado"], "b": ["banana"]} and by_first_letter([]) == {}`, explain: "defaultdict creates the missing list for you the first time a key appears." },
    { type: "predict", code: py`from collections import Counter
c = Counter("mississippi")
print(c["s"])
print(c["z"])
print(c.most_common(2))`,
      answer: py`4
0
[('i', 4), ('s', 4)]` },
    { type: "code", mode: "fix", prompt: py`<p>This crashes with a <code>KeyError</code>. Use <code>defaultdict</code> so it prints <code>{'a': ['apple', 'avocado'], 'b': ['banana']}</code>.</p>`,
      starter: py`groups = {}
for w in ["apple", "avocado", "banana"]:
    groups[w[0]].append(w)
print(groups)
`, solution: py`from collections import defaultdict

groups = defaultdict(list)
for w in ["apple", "avocado", "banana"]:
    groups[w[0]].append(w)
print(dict(groups))
`, hint: ["The first time a letter appears, its list doesn't exist yet.", "A defaultdict(list) makes an empty list for any new key."],
      tests: py`assert output.strip() == "{'a': ['apple', 'avocado'], 'b': ['banana']}"`, explain: "defaultdict saves the 'is the key there yet?' check." },
    { type: "quiz", q: "What does Counter(\"hello\").most_common(1) return?", options: ["[('l', 2)]", "('l', 2)", "'l'", "{'l': 2}"], answer: 0, why: [null, "most_common always returns a list of pairs, even for n=1.", "That is only the letter. The count comes with it.", "It returns a list of (item, count) tuples, not a dict."], explain: "The two l's are the most frequent, and the result is a list of (item, count) tuples." },
    { type: "code", prompt: py`<p>Write <code>most_common_word(text)</code> returning the word that appears most often, ignoring case. Words are separated by whitespace. On a tie return the alphabetically first word. Use <code>collections.Counter</code>.</p>`,
      starter: py`from collections import Counter


def most_common_word(text):
    pass
`, solution: py`from collections import Counter


def most_common_word(text):
    counts = Counter(text.lower().split())
    return min(counts, key=lambda w: (-counts[w], w))`, hint: "min with key=(-count, word) picks the highest count, then the alphabetically first word.",
      tests: py`assert most_common_word("the cat and the hat") == "the"
assert most_common_word("A a B b c") == "a"
assert most_common_word("Dog dog DOG cat") == "dog"` },
    { type: "code", boss: true, prompt: py`<p>Write <code>group_by_length(words)</code> returning a dict from word length to the list of words with that length, in their original order. Use <code>defaultdict(list)</code> and return a normal <code>dict</code>.</p>`,
      starter: py`from collections import defaultdict


def group_by_length(words):
    pass
`, solution: py`from collections import defaultdict


def group_by_length(words):
    groups = defaultdict(list)
    for word in words:
        groups[len(word)].append(word)
    return dict(groups)`, hint: "groups[len(word)].append(word) works without checking the key first.",
      tests: py`r = group_by_length(["a", "bb", "cc", "d", "eee"])
assert r == {1: ["a", "d"], 2: ["bb", "cc"], 3: ["eee"]}
assert type(r) is dict
assert group_by_length([]) == {}` },
  ]},
  { id: "funcdepth", rev: 2, needs: ["functions", "comprehensions"], level: 3, title: "Functions in Depth", blurb: "Defaults, *args, lambdas and closures", steps: [
    { type: "predict", probe: true, ask: "Before we start: what do you think this prints?", code: py`words = ["pear", "fig", "banana"]
print(sorted(words, key=len))`, answer: "['fig', 'pear', 'banana']", explain: "sorted can take a function as its key: it sorts by what that function returns for each word. len gives 4, 3 and 6, so the order is fig, pear, banana." },
    { type: "learn", title: "More ways to call and build functions", html: py`
      <p>Functions are values: you can pass them around and return them.</p>
      <pre data-try><code>def greet(name, greeting="Hello", *, punctuation="!"):
    return f"{greeting}, {name}{punctuation}"

print(greet("Ada"))
print(greet("Ada", punctuation="?"))

def total(*nums):                # any number of arguments
    return sum(nums)
print(total(1, 2, 3))

words = ["pear", "fig", "banana"]
print(sorted(words, key=lambda w: len(w)))   # lambda: tiny anonymous function

def make_adder(n):
    def add(x):
        return x + n             # remembers n: a closure
    return add
add5 = make_adder(5)
print(add5(10))</code></pre>
      <p><b>Warning:</b> never use a mutable default such as <code>def f(x, items=[])</code>. The same list is shared by every call. Use <code>None</code> and create the list inside.</p>` },
    { type: "fill", prompt: py`<p>Accept any number of arguments, and sort words by length with a lambda. It should print <code>6</code> and then <code>['fig', 'pear', 'banana']</code>.</p>`,
      template: py`def total(___):
    return sum(nums)

print(total(1, 2, 3))
print(sorted(["pear", "fig", "banana"], key=___ w: len(w)))
`, blanks: ["*nums", "lambda"], hint: ["A star before a parameter name collects all the extra arguments.", "A small unnamed function is written with the keyword lambda."],
      tests: py`assert output.strip() == "6\n['fig', 'pear', 'banana']"`, explain: "*args packs the arguments into a tuple, and a lambda is a tiny function written inline." },
    { type: "order", prompt: py`<p>Build <code>make_adder(n)</code>, which returns a function that adds <code>n</code> to whatever it is given. One line is a trap.</p>`,
      lines: ["def make_adder(n):", "    def add(x):", "        return x + n", "    return add"], distractors: ["return add()"],
      hint: ["The inner function sits inside the outer one.", "The outer function returns the inner function itself, without calling it."],
      tests: py`add5 = make_adder(5)
assert add5(10) == 15 and make_adder(1)(1) == 2 and callable(add5)`, explain: "The inner function remembers n even after make_adder has finished: that is a closure." },
    { type: "predict", code: py`def add(item, bucket=[]):
    bucket.append(item)
    return bucket

print(add(1))
print(add(2))
print(add(3, []))`,
      answer: py`[1]
[1, 2]
[3]` },
    { type: "code", mode: "fix", prompt: py`<p>Each call should start with a fresh list: it should print <code>['a']</code> and then <code>['b']</code>. Fix the shared default.</p>`,
      starter: py`def add_item(item, bucket=[]):
    bucket.append(item)
    return bucket

print(add_item("a"))
print(add_item("b"))
`, solution: py`def add_item(item, bucket=None):
    if bucket is None:
        bucket = []
    bucket.append(item)
    return bucket

print(add_item("a"))
print(add_item("b"))
`, hint: ["Look at the second line of output: where did 'a' come from?", "The default list is made once and reused by every call. Use None and make the list inside the function."],
      tests: py`assert output.split("\n")[:2] == ["['a']", "['b']"] and add_item("x", ["y"]) == ["y", "x"]`, explain: "A default value is created once, when the function is defined. Mutable defaults are shared by all calls." },
    { type: "code", prompt: py`<p>Write <code>make_multiplier(n)</code> that returns a function. The returned function takes <code>x</code> and returns <code>x * n</code>.</p>`,
      starter: py`def make_multiplier(n):
    pass
`, solution: py`def make_multiplier(n):
    def multiply(x):
        return x * n
    return multiply`, hint: "Define a function inside make_multiplier and return it (without calling it).",
      tests: py`double = make_multiplier(2)
triple = make_multiplier(3)
assert double(5) == 10
assert triple(5) == 15
assert double(triple(2)) == 12
assert callable(double)` },
    { type: "code", boss: true, prompt: py`<p>Write <code>clamp_all(*nums, low=0, high=100)</code> returning a list where each number is forced into the range <code>low</code> to <code>high</code>. <code>clamp_all(-5, 50, 200)</code> gives <code>[0, 50, 100]</code>.</p>`,
      starter: py`def clamp_all(*nums, low=0, high=100):
    pass
`, solution: py`def clamp_all(*nums, low=0, high=100):
    return [max(low, min(high, n)) for n in nums]`, hint: "max(low, min(high, n)) clamps one number.",
      tests: py`assert clamp_all(-5, 50, 200) == [0, 50, 100]
assert clamp_all() == []
assert clamp_all(1, 9, low=3, high=5) == [3, 5]` },
  ]},
  { id: "classes", rev: 2, needs: ["functions", "lists"], level: 3, title: "Classes & Objects", blurb: "Bundle data and behaviour together", steps: [
    { type: "predict", probe: true, ask: "Before we start: what do you think this prints?", code: py`class Dog:
    def __init__(self, name):
        self.name = name

    def bark(self):
        return self.name + " says woof"

print(Dog("Rex").bark())`, answer: "Rex says woof", explain: "Dog('Rex') builds a new object and runs __init__, which stores the name on that object. bark() can then read it back through self." },
    { type: "learn", title: "A class is a blueprint, an object is one thing built from it", html: py`
      <p>A <b>class</b> describes what data something holds (<b>attributes</b>) and what it can do (<b>methods</b>). Each <b>object</b> made from it has its own copy of the data.</p>
      <pre data-try><code>class Dog:
    def __init__(self, name):      # runs when you create a Dog
        self.name = name
        self.tricks = []

    def learn(self, trick):
        self.tricks.append(trick)

    def show(self):
        return f"{self.name} knows {len(self.tricks)} trick(s)"

rex = Dog("Rex")
fido = Dog("Fido")
rex.learn("sit")
print(rex.show())
print(fido.show())</code></pre>
      <p><code>self</code> is the object the method was called on. <code>rex.learn("sit")</code> is the same as <code>Dog.learn(rex, "sit")</code>.</p>` },
    { type: "fill", prompt: py`<p>Complete the class so it prints <code>Tom says meow</code>.</p>`,
      template: py`class Cat:
    def __init__(___, name):
        self.name = name

    def speak(self):
        return f"{self.___} says meow"

print(Cat("Tom").speak())
`, blanks: ["self", "name"], hint: ["Every method receives the object as its first parameter.", "The attribute you stored in __init__ is read back with self.name."],
      tests: py`assert output.strip() == "Tom says meow"`, explain: "self is the object the method was called on. It is how methods reach that object's data." },
    { type: "order", prompt: py`<p>Build a <code>Counter</code> class that starts at 0 and can count up. One line is a trap.</p>`,
      lines: ["class Counter:", "    def __init__(self):", "        self.count = 0", "    def increment(self):", "        self.count += 1"], distractors: ["        self.count = 0"],
      hint: ["__init__ sets up the starting value.", "increment changes the attribute it stored."],
      tests: py`c = Counter()
assert c.count == 0
c.increment()
c.increment()
assert c.count == 2
assert Counter().count == 0`, explain: "State lives in attributes, and methods change it through self." },
    { type: "predict", code: py`class Dog:
    def __init__(self, name):
        self.name = name
        self.tricks = []

    def learn(self, trick):
        self.tricks.append(trick)

a = Dog("Rex")
b = Dog("Fido")
a.learn("sit")
print(a.tricks)
print(b.tricks)
print(a.name, b.name)`,
      answer: py`['sit']
[]
Rex Fido` },
    { type: "code", mode: "fix", prompt: py`<p>This crashes: the name is never stored on the object. Fix it so it prints <code>Rex says woof</code>.</p>`,
      starter: py`class Dog:
    def __init__(self, name):
        name = name

    def bark(self):
        return self.name + " says woof"

print(Dog("Rex").bark())
`, solution: py`class Dog:
    def __init__(self, name):
        self.name = name

    def bark(self):
        return self.name + " says woof"

print(Dog("Rex").bark())
`, hint: ["Which line is supposed to save the name on the object?", "name = name only sets a local variable. Attach it to the object with self.name."],
      tests: py`assert output.strip() == "Rex says woof"`, explain: "A plain variable inside __init__ disappears when it ends. Only self.something stays with the object." },
    { type: "quiz", q: "In a method, what does self refer to?", options: ["The object the method was called on", "The class itself", "The module", "The method's return value"], answer: 0, why: [null, "The class is the blueprint. self is one specific object made from it.", "Modules are files you import. self is not related to them.", "self is an input to the method, not its output."], explain: "When you write rex.learn(...), Python passes rex in as self." },
    { type: "code", prompt: py`<p>Write a class <code>Rectangle</code> created with <code>Rectangle(width, height)</code>. Give it methods <code>area()</code>, <code>perimeter()</code> and <code>is_square()</code>.</p>`,
      starter: py`class Rectangle:
    pass
`, solution: py`class Rectangle:
    def __init__(self, width, height):
        self.width = width
        self.height = height

    def area(self):
        return self.width * self.height

    def perimeter(self):
        return 2 * (self.width + self.height)

    def is_square(self):
        return self.width == self.height`, hint: "Store width and height in __init__, then read them back through self in each method.",
      tests: py`r = Rectangle(3, 4)
assert r.area() == 12 and r.perimeter() == 14
assert r.is_square() is False
assert Rectangle(5, 5).is_square() is True
r.width = 10
assert r.area() == 40, "Methods should read the current attributes"` },
    { type: "code", boss: true, prompt: py`<p>Write a class <code>BankAccount</code> starting at balance 0. <code>deposit(amount)</code> and <code>withdraw(amount)</code> change <code>balance</code>. Amounts must be positive and you cannot withdraw more than the balance. In both cases raise <code>ValueError</code> and leave the balance alone.</p>`,
      starter: py`class BankAccount:
    pass
`, solution: py`class BankAccount:
    def __init__(self):
        self.balance = 0

    def deposit(self, amount):
        if amount <= 0:
            raise ValueError("amount must be positive")
        self.balance += amount

    def withdraw(self, amount):
        if amount <= 0:
            raise ValueError("amount must be positive")
        if amount > self.balance:
            raise ValueError("insufficient funds")
        self.balance -= amount`, hint: "Check the bad cases first and raise before changing self.balance.",
      tests: py`a = BankAccount()
assert a.balance == 0
a.deposit(100)
a.withdraw(30)
assert a.balance == 70
for bad in (lambda: a.deposit(0), lambda: a.withdraw(-5), lambda: a.withdraw(71)):
    try:
        bad()
    except ValueError:
        pass
    else:
        raise AssertionError("expected ValueError")
assert a.balance == 70
b = BankAccount()
assert b.balance == 0, "Each account has its own balance"` },
  ]},
  { id: "dunder", rev: 2, needs: ["classes"], level: 3, title: "Special Methods", blurb: "Make your objects work with print, +, == and len", steps: [
    { type: "predict", probe: true, ask: "Before we start: what do you think this prints?", code: py`class Box:
    def __init__(self, items):
        self.items = items

    def __len__(self):
        return len(self.items)

print(len(Box([1, 2, 3])))`, answer: "3", explain: "len() asks the object for its length by calling __len__. Define the special method and your class works with the built-in function." },
    { type: "learn", title: "Methods with double underscores plug into Python", html: py`
      <p>Python calls special methods (called <b>dunder</b> methods) behind the scenes. Define them and your objects behave like built-in types.</p>
      <pre data-try><code>class Money:
    def __init__(self, cents):
        self.cents = cents

    def __repr__(self):              # how it prints
        return f"Money({self.cents})"

    def __add__(self, other):        # a + b
        return Money(self.cents + other.cents)

    def __eq__(self, other):         # a == b
        return self.cents == other.cents

    def __lt__(self, other):         # a < b (enables sorted)
        return self.cents < other.cents

a, b = Money(150), Money(275)
print(a + b)
print(a == Money(150))
print(sorted([b, a]))</code></pre>
      <p>Others you will meet: <code>__len__</code> (len), <code>__contains__</code> (in), <code>__getitem__</code> (indexing), <code>__iter__</code> (for loops).</p>` },
    { type: "fill", prompt: py`<p>Make <code>Money</code> print nicely and support <code>+</code>. It should print <code>Money(175)</code>.</p>`,
      template: py`class Money:
    def __init__(self, cents):
        self.cents = cents

    def ___(self):
        return f"Money({self.cents})"

    def __add__(self, other):
        return Money(self.cents ___ other.cents)

print(Money(150) + Money(25))
`, blanks: ["__repr__", "+"], hint: ["print needs a method that returns the text to show.", "__add__ is where + is defined. Add the two amounts."],
      tests: py`assert output.strip() == "Money(175)"`, explain: "Special methods plug your class into print, +, ==, len and more." },
    { type: "order", prompt: py`<p>Teach <code>Point</code> to compare itself with <code>==</code>. One line is a trap.</p>`,
      lines: ["class Point:", "    def __init__(self, x, y):", "        self.x = x", "        self.y = y", "    def __eq__(self, other):", "        return self.x == other.x and self.y == other.y"], distractors: ["    def __eq__(self):"],
      hint: ["Set up x and y before defining the comparison.", "__eq__ receives the other object as a second argument."],
      tests: py`assert Point(1, 2) == Point(1, 2) and Point(1, 2) != Point(2, 1) and not (Point(0, 0) == Point(0, 1))`, explain: "Without __eq__, two different objects with equal data would still count as not equal." },
    { type: "predict", code: py`class P:
    def __init__(self, x):
        self.x = x

    def __repr__(self):
        return f"P({self.x})"

    def __add__(self, other):
        return P(self.x + other.x)

print(P(1) + P(2))
print([P(3), P(4)])`,
      answer: py`P(3)
[P(3), P(4)]` },
    { type: "code", mode: "fix", prompt: py`<p>Printing a <code>P</code> should show <code>P(1)</code> but it crashes. Fix <code>__repr__</code>.</p>`,
      starter: py`class P:
    def __init__(self, x):
        self.x = x

    def __repr__(self):
        print(f"P({self.x})")

print(P(1))
`, solution: py`class P:
    def __init__(self, x):
        self.x = x

    def __repr__(self):
        return f"P({self.x})"

print(P(1))
`, hint: ["Read the error: what does Python expect __repr__ to give back?", "__repr__ must return the text, not print it."],
      tests: py`assert output.strip() == "P(1)"`, explain: "Special methods hand a result back to Python. Printing inside them gives Python nothing to work with." },
    { type: "quiz", q: "Which special method runs when you write len(obj)?", options: ["__len__", "__size__", "__count__", "__length__"], answer: 0, why: [null, "There is no __size__ in Python's data model.", "__count__ is not a special method.", "The shortened name __len__ is the one len() calls."], explain: "len(obj) calls obj.__len__()." },
    { type: "code", prompt: py`<p>Write a class <code>Playlist</code> created with <code>Playlist()</code>. <code>add(song)</code> appends a song. Make <code>len(p)</code> return the number of songs and <code>"title" in p</code> work.</p>`,
      starter: py`class Playlist:
    pass
`, solution: py`class Playlist:
    def __init__(self):
        self.songs = []

    def add(self, song):
        self.songs.append(song)

    def __len__(self):
        return len(self.songs)

    def __contains__(self, song):
        return song in self.songs`, hint: "Define __len__ and __contains__ and delegate to the inner list.",
      tests: py`p = Playlist()
assert len(p) == 0
p.add("Intro")
p.add("Outro")
assert len(p) == 2
assert "Intro" in p
assert "Missing" not in p` },
    { type: "code", boss: true, prompt: py`<p>Write a class <code>Vector</code> created with <code>Vector(x, y)</code>. Support <code>v + w</code> (add coordinates), <code>v == w</code>, and print as <code>Vector(1, 2)</code> (define <code>__repr__</code>).</p>`,
      starter: py`class Vector:
    pass
`, solution: py`class Vector:
    def __init__(self, x, y):
        self.x = x
        self.y = y

    def __add__(self, other):
        return Vector(self.x + other.x, self.y + other.y)

    def __eq__(self, other):
        return self.x == other.x and self.y == other.y

    def __repr__(self):
        return f"Vector({self.x}, {self.y})"`, hint: "__add__ returns a new Vector. __repr__ returns a string.",
      tests: py`v, w = Vector(1, 2), Vector(3, 4)
assert repr(v) == "Vector(1, 2)"
assert str(v + w) == "Vector(4, 6)"
assert v + w == Vector(4, 6)
assert v != w
assert v.x == 1, "Adding must not change v"` },
  ]},
  { id: "inherit", rev: 2, needs: ["classes"], level: 3, title: "Inheritance & Polymorphism", blurb: "Reuse and specialise classes", steps: [
    { type: "predict", probe: true, ask: "Before we start: what do you think this prints?", code: py`class Animal:
    def speak(self):
        return "..."

class Dog(Animal):
    def speak(self):
        return "Woof"

print(Animal().speak(), Dog().speak())`, answer: "... Woof", explain: "Dog inherits from Animal but overrides speak. Animal still says '...', while Dog uses its own version." },
    { type: "learn", title: "A subclass is a more specific version of its parent", html: py`
      <p>A class can <b>inherit</b> from another, getting all its attributes and methods for free, then <b>override</b> the ones it wants to change. <code>super()</code> calls the parent's version.</p>
      <pre data-try><code>class Animal:
    def __init__(self, name):
        self.name = name

    def speak(self):
        return "..."

    def intro(self):
        return f"{self.name} says {self.speak()}"

class Dog(Animal):
    def speak(self):               # override
        return "Woof"

class Puppy(Dog):
    def __init__(self, name):
        super().__init__(name)     # reuse the parent's setup
        self.age = 0

for pet in [Animal("Thing"), Dog("Rex"), Puppy("Bit")]:
    print(pet.intro())             # same call, different behaviour</code></pre>
      <p>That last loop is <b>polymorphism</b>: the caller does not care which subclass it has, only that it has <code>intro()</code>. Prefer inheritance for "is a" (a Dog is an Animal), and plain attributes for "has a" (a Car has an Engine).</p>` },
    { type: "fill", prompt: py`<p>A <code>Bike</code> is a kind of <code>Vehicle</code> with 2 wheels. It should print <code>2</code>.</p>`,
      template: py`class Vehicle:
    def __init__(self, wheels):
        self.wheels = wheels

class Bike(___):
    def __init__(self):
        ___().__init__(2)

print(Bike().wheels)
`, blanks: ["Vehicle", "super"], hint: ["The parent class goes in the brackets.", "super() gives you the parent so you can reuse its setup."],
      tests: py`assert output.strip() == "2"`, explain: "super().__init__(...) runs the parent's setup so you don't repeat it." },
    { type: "order", prompt: py`<p>A <code>Puppy</code> is a <code>Dog</code> that also stores an age of 0. One line is a trap.</p>`,
      given: py`class Dog:
    def __init__(self, name):
        self.name = name
`,
      lines: ["class Puppy(Dog):", "    def __init__(self, name):", "        super().__init__(name)", "        self.age = 0"], distractors: ["        super().__init__()"],
      hint: ["The parent's setup runs first.", "Then add what is new about the subclass."],
      tests: py`p = Puppy("Bit")
assert p.name == "Bit" and p.age == 0 and isinstance(p, Dog)`, explain: "A subclass reuses the parent's setup, then adds its own attributes." },
    { type: "predict", code: py`class A:
    def hello(self):
        return "A"

    def greet(self):
        return "hi " + self.hello()

class B(A):
    def hello(self):
        return "B"

print(A().greet())
print(B().greet())
print(isinstance(B(), A))`,
      answer: py`hi A
hi B
True` },
    { type: "code", mode: "fix", prompt: py`<p>The <code>Dog</code> forgot to set up its parent, so the name is missing. It should print <code>Rex 3</code>. Fix it.</p>`,
      starter: py`class Animal:
    def __init__(self, name):
        self.name = name

class Dog(Animal):
    def __init__(self, name, tricks):
        self.tricks = tricks

d = Dog("Rex", 3)
print(d.name, d.tricks)
`, solution: py`class Animal:
    def __init__(self, name):
        self.name = name

class Dog(Animal):
    def __init__(self, name, tricks):
        super().__init__(name)
        self.tricks = tricks

d = Dog("Rex", 3)
print(d.name, d.tricks)
`, hint: ["Which attribute is missing, and who is supposed to set it?", "When a subclass defines its own __init__, the parent's __init__ no longer runs by itself. Call it with super()."],
      tests: py`assert output.strip() == "Rex 3"`, explain: "Overriding __init__ replaces the parent's setup. super().__init__() brings it back." },
    { type: "quiz", q: "A Car class needs an Engine. What is the better design?", options: ["Car has an Engine attribute", "Car inherits from Engine", "Engine inherits from Car", "Copy the engine code into Car"], answer: 0, why: [null, "A car is not a kind of engine. Inheritance means \"is a\".", "An engine is not a kind of car.", "Copying means every fix has to be made twice."], explain: "\"Has a\" is composition: store an Engine object as an attribute. Use inheritance only for \"is a\"." },
    { type: "code", prompt: py`<p>Write <code>Employee(name, salary)</code> with <code>pay()</code> returning the salary. Then <code>Manager(name, salary, bonus)</code> inheriting from it, whose <code>pay()</code> is salary plus bonus. Use <code>super().__init__</code>.</p>`,
      starter: py`class Employee:
    pass
`, solution: py`class Employee:
    def __init__(self, name, salary):
        self.name = name
        self.salary = salary

    def pay(self):
        return self.salary


class Manager(Employee):
    def __init__(self, name, salary, bonus):
        super().__init__(name, salary)
        self.bonus = bonus

    def pay(self):
        return super().pay() + self.bonus`, hint: "In Manager.pay you can call super().pay() and add the bonus.",
      tests: py`e = Employee("Ann", 1000)
m = Manager("Bob", 2000, 500)
assert e.pay() == 1000 and m.pay() == 2500
assert m.name == "Bob" and m.salary == 2000
assert isinstance(m, Employee)
assert sum(x.pay() for x in [e, m]) == 3500` },
    { type: "code", boss: true, prompt: py`<p>Write a base class <code>Shape</code> whose <code>area()</code> raises <code>NotImplementedError</code>. Then <code>Square(side)</code> and <code>Circle(radius)</code> subclasses that implement <code>area()</code> (use <code>math.pi</code> for the circle).</p>`,
      starter: py`import math


class Shape:
    pass
`, solution: py`import math


class Shape:
    def area(self):
        raise NotImplementedError


class Square(Shape):
    def __init__(self, side):
        self.side = side

    def area(self):
        return self.side ** 2


class Circle(Shape):
    def __init__(self, radius):
        self.radius = radius

    def area(self):
        return math.pi * self.radius ** 2`, hint: "class Square(Shape): puts Shape in brackets. Override area in each subclass.",
      tests: py`import math
assert Square(3).area() == 9
assert abs(Circle(1).area() - math.pi) < 1e-9
assert isinstance(Square(1), Shape) and isinstance(Circle(1), Shape)
try:
    Shape().area()
except NotImplementedError:
    pass
else:
    raise AssertionError("Shape.area should raise NotImplementedError")
assert round(sum(s.area() for s in [Square(2), Square(3)])) == 13` },
  ]},
  { id: "encap", rev: 2, needs: ["classes", "errors"], level: 3, title: "Encapsulation & Properties", blurb: "Protect your data with validation", steps: [
    { type: "predict", probe: true, ask: "Before we start: what do you think this prints?", code: py`class Person:
    def __init__(self, age):
        self._age = age

    @property
    def age(self):
        return self._age

p = Person(30)
print(p.age)`, answer: "30", explain: "A property looks like a plain attribute from the outside: you write p.age, not p.age(). Behind the scenes it runs the method and returns the protected _age." },
    { type: "learn", title: "Control how attributes are read and changed", html: py`
      <p>By convention a name starting with an underscore, such as <code>_balance</code>, means "internal, please don't touch". A <b>property</b> lets you keep a clean <code>obj.attr</code> syntax while running code (like validation) on every read or write.</p>
      <pre data-try><code>class Person:
    def __init__(self, age):
        self.age = age               # goes through the setter

    @property
    def age(self):
        return self._age

    @age.setter
    def age(self, value):
        if value < 0:
            raise ValueError("age cannot be negative")
        self._age = value

p = Person(30)
p.age = 31
print(p.age)
try:
    p.age = -1
except ValueError as e:
    print("rejected:", e)</code></pre>
      <p>A <b>class attribute</b> is shared by all objects of the class (<code>total = 0</code> written in the class body). An <b>instance attribute</b> is set through <code>self</code> and belongs to one object.</p>` },
    { type: "fill", prompt: py`<p>Turn <code>area</code> into a property, so it is read like an attribute. It should print <code>12</code>.</p>`,
      template: py`class Circle:
    def __init__(self, r):
        self.r = r

    @___
    def area(self):
        return 3 * self.r ** 2

print(Circle(2).___)
`, blanks: ["property", "area"], hint: ["The decorator that turns a method into an attribute-like value.", "Read it without brackets."],
      tests: py`assert output.strip() == "12"`, explain: "@property lets you compute a value on demand while keeping a plain attribute-style interface." },
    { type: "order", prompt: py`<p>Build a <code>Person</code> whose <code>age</code> can never be negative. One line is a trap.</p>`,
      lines: ["class Person:", "    def __init__(self, age):", "        self.age = age", "    @property", "    def age(self):", "        return self._age", "    @age.setter", "    def age(self, value):", "        if value < 0:", "            raise ValueError(\"negative\")", "        self._age = value"], distractors: ["        self.age = value"],
      hint: ["__init__ goes first, then the getter, then the setter.", "The setter checks the value before storing it in _age."],
      tests: py`p = Person(30)
assert p.age == 30
p.age = 31
assert p.age == 31
for bad in (lambda: Person(-1), lambda: setattr(p, "age", -5)):
    try:
        bad()
    except ValueError:
        pass
    else:
        raise AssertionError("expected ValueError")
assert p.age == 31`, explain: "The setter is the single gate every change goes through, so validation can't be skipped." },
    { type: "predict", code: py`class C:
    total = 0

    def __init__(self):
        C.total += 1
        self.n = C.total

a = C()
b = C()
print(a.n, b.n, C.total)
a.total = 10
print(a.total, b.total, C.total)`,
      answer: py`1 2 2
10 2 2` },
    { type: "code", mode: "fix", prompt: py`<p>Reading <code>Person(30).age</code> crashes with a <code>RecursionError</code>. Fix the property.</p>`,
      starter: py`class Person:
    def __init__(self, age):
        self._age = age

    @property
    def age(self):
        return self.age

print(Person(30).age)
`, solution: py`class Person:
    def __init__(self, age):
        self._age = age

    @property
    def age(self):
        return self._age

print(Person(30).age)
`, hint: ["The property asks for self.age. What does self.age run?", "return self.age calls the property again, forever. Return the underscored value instead."],
      tests: py`assert output.strip() == "30"`, explain: "A property can't read itself. It reads the protected attribute (_age) that holds the data." },
    { type: "quiz", q: "What does a name like _balance signal?", options: ["It is internal: other code should not use it directly", "Python blocks all access to it", "It is a constant", "It is a class attribute"], answer: 0, why: [null, "Python does not enforce it. The underscore is a convention between programmers.", "Constants are usually written in CAPITALS, and nothing stops them changing either.", "Single underscore says nothing about class vs instance."], explain: "It is a polite \"keep out\" sign. Python trusts you to respect it." },
    { type: "code", prompt: py`<p>Write a class <code>Ticket</code>. Each new ticket gets the next id: the first one has <code>id</code> 1, then 2, and so on, shared across all tickets. Use a class attribute to keep count.</p>`,
      starter: py`class Ticket:
    pass
`, solution: py`class Ticket:
    created = 0

    def __init__(self):
        Ticket.created += 1
        self.id = Ticket.created`, hint: "A variable written directly in the class body is shared. Update it with Ticket.created += 1.",
      tests: py`a, b, c = Ticket(), Ticket(), Ticket()
assert (a.id, b.id, c.id) == (1, 2, 3)
assert Ticket.created == 3
assert a.id == 1, "an id must not change later"` },
    { type: "code", boss: true, prompt: py`<p>Write a class <code>Temperature</code> created with <code>Temperature(celsius)</code>. It has a <code>celsius</code> property that raises <code>ValueError</code> for anything below -273.15 (also in <code>__init__</code>), and a read-only <code>fahrenheit</code> property (<code>c * 9 / 5 + 32</code>).</p>`,
      starter: py`class Temperature:
    pass
`, solution: py`class Temperature:
    def __init__(self, celsius):
        self.celsius = celsius

    @property
    def celsius(self):
        return self._celsius

    @celsius.setter
    def celsius(self, value):
        if value < -273.15:
            raise ValueError("below absolute zero")
        self._celsius = value

    @property
    def fahrenheit(self):
        return self._celsius * 9 / 5 + 32`, hint: "Store the value in self._celsius and expose it with @property and @celsius.setter.",
      tests: py`t = Temperature(100)
assert t.celsius == 100 and t.fahrenheit == 212
t.celsius = 0
assert t.fahrenheit == 32
for bad in (lambda: Temperature(-300), lambda: setattr(t, "celsius", -274)):
    try:
        bad()
    except ValueError:
        pass
    else:
        raise AssertionError("expected ValueError")
assert t.celsius == 0
try:
    t.fahrenheit = 5
except AttributeError:
    pass
else:
    raise AssertionError("fahrenheit must be read-only")` },
  ]},
  { id: "testing", rev: 2, needs: ["errors", "functions"], level: 3, title: "Testing & Debugging", blurb: "Prove your code works and find why it does not", steps: [
    { type: "predict", probe: true, ask: "Before we start: what do you think this prints?", code: py`def check(x):
    assert x > 0, "must be positive"
    return x

print(check(3))`, answer: "3", explain: "assert does nothing when the condition is true, so check(3) simply returns 3. It only raises an error when the condition is false." },
    { type: "learn", title: "If you did not test it, it does not work", html: py`
      <p>A <b>test</b> runs your code on chosen inputs and checks the result. <code>assert</code> raises an error when a condition is false. Good test cases cover:</p>
      <ul>
        <li>the <b>normal</b> case</li>
        <li><b>edges</b>: empty input, one item, zero, negative numbers</li>
        <li><b>errors</b>: bad input that should be rejected</li>
      </ul>
      <pre data-try><code>def average(nums):
    return sum(nums) / len(nums)

assert average([2, 4]) == 3
assert average([5]) == 5

try:
    average([])
except ZeroDivisionError:
    print("edge case found: empty list crashes")</code></pre>
      <p><b>Debugging</b> is a method, not luck: (1) reproduce the bug with the smallest input, (2) read the error message, from the bottom line up, (3) look at the real values, using <code>print</code> or the <b>Watch it run</b> button, (4) change one thing, then re-run the test.</p>` },
    { type: "fill", prompt: py`<p>Write the expected results in the assertions. If both are right, the program prints <code>all good</code>.</p>`,
      template: py`def is_even(n):
    return n % 2 == 0

assert is_even(4) is ___
assert is_even(7) is ___
print("all good")
`, blanks: ["True", "False"], hint: ["4 is even.", "7 is odd, so the function gives back False."],
      tests: py`assert output.strip() == "all good"`, explain: "An assert is a claim about your code. If it is wrong, the program stops and tells you." },
    { type: "order", prompt: py`<p>Write a tiny test runner: <code>run_tests(tests)</code> calls each test function and counts how many returned a false value. One line is a trap.</p>`,
      lines: ["def run_tests(tests):", "    failed = 0", "    for t in tests:", "        if not t():", "            failed += 1", "    return failed"], distractors: ["            failed -= 1"],
      hint: ["Start the counter, loop over the tests, then return the counter.", "Only count a failure when the test is not truthy."],
      tests: py`assert run_tests([lambda: True, lambda: False, lambda: 0]) == 2 and run_tests([]) == 0`, explain: "This is the idea behind every testing tool: run many small checks and report which ones failed." },
    { type: "predict", code: py`def check(x):
    assert x > 0, "must be positive"
    return x

for v in (3, -1, 5):
    try:
        print(check(v))
    except AssertionError as e:
        print("failed:", e)`,
      answer: py`3
failed: must be positive
5` },
    { type: "code", mode: "fix", prompt: py`<p><b>Debug it.</b> <code>median(nums)</code> should return the middle value of a list (for an even count, the average of the two middle values). It has a bug. Find it and fix it.</p>`,
      starter: py`def median(nums):
    mid = len(nums) // 2
    if len(nums) % 2 == 1:
        return nums[mid]
    return (nums[mid - 1] + nums[mid]) / 2
`, solution: py`def median(nums):
    ordered = sorted(nums)
    mid = len(ordered) // 2
    if len(ordered) % 2 == 1:
        return ordered[mid]
    return (ordered[mid - 1] + ordered[mid]) / 2`, hint: "It only works when the list is already sorted. Sort a copy first.",
      tests: py`assert median([1, 2, 3]) == 2
assert median([3, 1, 2]) == 2
assert median([4, 1, 3, 2]) == 2.5
assert median([9]) == 9
a = [5, 1, 3]
median(a)
assert a == [5, 1, 3], "Don't change the caller's list"` },
    { type: "quiz", q: "Which input is most likely to expose a bug in max_of(nums)?", options: ["An empty list", "[1, 2, 3]", "[10, 20, 30]", "[5, 6, 7]"], answer: 0, why: [null, "Nearly any implementation works for a normal ascending list. That proves little.", "Bigger numbers are not a different case.", "Another ordinary list, so it adds no new information."], explain: "Empty input is the classic edge case. Normal inputs rarely reveal bugs." },
    { type: "code", boss: true, prompt: py`<p>Build a tiny test runner. <code>failing(func, cases)</code> takes a function and a list of <code>(args, expected)</code> pairs, where <code>args</code> is a tuple. Return the list of cases whose result differs from <code>expected</code>. A case that raises an exception also fails.</p>`,
      starter: py`def failing(func, cases):
    pass
`, solution: py`def failing(func, cases):
    bad = []
    for args, expected in cases:
        try:
            ok = func(*args) == expected
        except Exception:
            ok = False
        if not ok:
            bad.append((args, expected))
    return bad`, hint: "Call func(*args) inside try. Treat an exception like a wrong answer.",
      tests: py`def double(x):
    return x * 2

def broken(x):
    return 1 / x

assert failing(double, [((2,), 4), ((0,), 0)]) == []
assert failing(double, [((2,), 5), ((3,), 6)]) == [((2,), 5)]
assert failing(broken, [((2,), 0.5), ((0,), 0)]) == [((0,), 0)]
assert failing(double, []) == []` },
  ]},
  { id: "bank", kind: "project", needs: ["encap", "errors"], level: 3, title: "Mini: Bank Account", blurb: "A safe class with validation, history and custom errors", steps: [
    { type: "learn", title: "Protect the balance", html: py`
      <p>A bank must never let a balance go wrong. That is the perfect use of a <b>class</b>: keep the data private-ish, expose a few safe methods, and raise clear errors for bad requests.</p>
      <pre data-try><code>class InsufficientFunds(Exception):
    pass

class Account:
    def __init__(self, owner):
        self.owner = owner
        self._balance = 0

    @property
    def balance(self):
        return self._balance

    def deposit(self, amount):
        self._balance += amount

acct = Account("Ada")
acct.deposit(50)
print(acct.balance)</code></pre>` },
    { type: "code", prompt: py`<p><b>Piece 1.</b> Make <code>deposit</code> and <code>withdraw</code> safe. Amounts must be positive (<code>ValueError</code> otherwise). Withdrawing more than the balance raises <code>InsufficientFunds</code> and changes nothing.</p>`,
      starter: py`class InsufficientFunds(Exception):
    pass

class Account:
    def __init__(self, owner):
        self.owner = owner
        self._balance = 0

    @property
    def balance(self):
        return self._balance

    def deposit(self, amount):
        pass

    def withdraw(self, amount):
        pass
`, solution: py`class InsufficientFunds(Exception):
    pass

class Account:
    def __init__(self, owner):
        self.owner = owner
        self._balance = 0

    @property
    def balance(self):
        return self._balance

    def deposit(self, amount):
        if amount <= 0:
            raise ValueError("amount must be positive")
        self._balance += amount

    def withdraw(self, amount):
        if amount <= 0:
            raise ValueError("amount must be positive")
        if amount > self._balance:
            raise InsufficientFunds(f"balance is only {self._balance}")
        self._balance -= amount`, hint: "Validate first, change the balance last, so a failed call leaves it untouched.",
      tests: py`a = Account("Ada")
a.deposit(100)
a.withdraw(30)
assert a.balance == 70
for bad in (0, -5):
    for op in (a.deposit, a.withdraw):
        try:
            op(bad)
        except ValueError:
            pass
        else:
            raise AssertionError(f"{op.__name__}({bad}) should raise ValueError")
try:
    a.withdraw(71)
except InsufficientFunds:
    pass
else:
    raise AssertionError("overdraft should raise InsufficientFunds")
assert a.balance == 70, "a failed withdrawal changes nothing"
try:
    a.balance = 5
except AttributeError:
    pass
else:
    raise AssertionError("balance must be read-only")` },
    { type: "code", prompt: py`<p><b>Piece 2.</b> Keep a history. Every successful deposit/withdrawal appends a tuple like <code>("deposit", 50)</code> or <code>("withdraw", 20)</code> to <code>self.history</code> (a list, starting empty). Add a method <code>statement()</code> returning one line per entry such as <code>"deposit 50"</code>, joined by <code>"\n"</code>.</p>`,
      starter: py`class InsufficientFunds(Exception):
    pass

class Account:
    def __init__(self, owner):
        self.owner = owner
        self._balance = 0
        self.history = []

    @property
    def balance(self):
        return self._balance

    def deposit(self, amount):
        if amount <= 0:
            raise ValueError("amount must be positive")
        self._balance += amount

    def withdraw(self, amount):
        if amount <= 0:
            raise ValueError("amount must be positive")
        if amount > self._balance:
            raise InsufficientFunds(f"balance is only {self._balance}")
        self._balance -= amount

    def statement(self):
        pass
`, solution: py`class InsufficientFunds(Exception):
    pass

class Account:
    def __init__(self, owner):
        self.owner = owner
        self._balance = 0
        self.history = []

    @property
    def balance(self):
        return self._balance

    def deposit(self, amount):
        if amount <= 0:
            raise ValueError("amount must be positive")
        self._balance += amount
        self.history.append(("deposit", amount))

    def withdraw(self, amount):
        if amount <= 0:
            raise ValueError("amount must be positive")
        if amount > self._balance:
            raise InsufficientFunds(f"balance is only {self._balance}")
        self._balance -= amount
        self.history.append(("withdraw", amount))

    def statement(self):
        return "\n".join(f"{kind} {amount}" for kind, amount in self.history)`, hint: "Record the entry only after the balance changed, so failed calls leave no trace.",
      tests: py`a = Account("Bo")
a.deposit(50)
a.withdraw(20)
try:
    a.withdraw(999)
except InsufficientFunds:
    pass
assert a.history == [("deposit", 50), ("withdraw", 20)], "failed operations are not recorded"
assert a.statement() == "deposit 50\nwithdraw 20"
assert Account("Cy").statement() == ""` },
    { type: "code", prompt: py`<p><b>Piece 3.</b> Add a module-level function <code>transfer(src, dst, amount)</code> that moves money between two accounts. If the withdrawal fails nothing may change on either account (so withdraw first, deposit second).</p>`,
      starter: py`class InsufficientFunds(Exception):
    pass

class Account:
    def __init__(self, owner):
        self.owner = owner
        self._balance = 0

    @property
    def balance(self):
        return self._balance

    def deposit(self, amount):
        if amount <= 0:
            raise ValueError("amount must be positive")
        self._balance += amount

    def withdraw(self, amount):
        if amount <= 0:
            raise ValueError("amount must be positive")
        if amount > self._balance:
            raise InsufficientFunds(f"balance is only {self._balance}")
        self._balance -= amount

def transfer(src, dst, amount):
    pass
`, solution: py`class InsufficientFunds(Exception):
    pass

class Account:
    def __init__(self, owner):
        self.owner = owner
        self._balance = 0

    @property
    def balance(self):
        return self._balance

    def deposit(self, amount):
        if amount <= 0:
            raise ValueError("amount must be positive")
        self._balance += amount

    def withdraw(self, amount):
        if amount <= 0:
            raise ValueError("amount must be positive")
        if amount > self._balance:
            raise InsufficientFunds(f"balance is only {self._balance}")
        self._balance -= amount

def transfer(src, dst, amount):
    src.withdraw(amount)
    dst.deposit(amount)`, hint: "Two lines. If withdraw raises, deposit is never reached.",
      tests: py`a, b = Account("A"), Account("B")
a.deposit(100)
transfer(a, b, 40)
assert (a.balance, b.balance) == (60, 40)
try:
    transfer(a, b, 500)
except InsufficientFunds:
    pass
assert (a.balance, b.balance) == (60, 40), "a failed transfer changes nothing"` },
  ]},
  ]
},
{
  id: "textdata", title: "Text & Data", desc: "Regular expressions, JSON, CSV and log files", color: "green",
  lessons: [
  { id: "regex", rev: 2, needs: ["strings", "errors"], level: 2, title: "Regular Expressions", blurb: "Find and reshape patterns in text", steps: [
    { type: "predict", probe: true, ask: "Before we start: what do you think this prints?", code: py`import re
print(re.search(r"\d+", "room 101, floor 2").group())`, answer: "101", explain: "search finds the first match of the pattern anywhere in the text. \\d+ means one or more digits, so the first run of digits is 101." },
    { type: "learn", title: "Patterns, not exact text", html: py`
      <p><code>"abc" in text</code> finds exact text. A <b>regular expression</b> (regex) finds a <i>pattern</i>: "any run of digits", "a word followed by @". Python's <code>re</code> module does it.</p>
      <pre data-try><code>import re
text = "Call 555-0142 or 555-0199 today"
print(re.findall(r"\d{3}-\d{4}", text))
print(re.search(r"\d+", text).group())
print(re.sub(r"\d", "#", text))</code></pre>
      <p>The building blocks: <code>\d</code> a digit, <code>\w</code> a letter/digit/underscore, <code>\s</code> whitespace, <code>.</code> anything, <code>+</code> one or more, <code>*</code> zero or more, <code>?</code> optional, <code>{3}</code> exactly three, <code>[abc]</code> one of these. Write patterns as raw strings <code>r"..."</code> so backslashes survive.</p>` },
    { type: "learn", title: "Groups pull out the pieces", html: py`
      <p>Parentheses <b>capture</b> parts of a match:</p>
      <pre data-try><code>import re
m = re.search(r"(\d{4})-(\d{2})-(\d{2})", "Born on 1815-12-10 in London")
print(m.group(0))
print(m.groups())
year, month, day = map(int, m.groups())
print(year + 1)

named = re.search(r"(?P<user>\w+)@(?P<host>[\w.]+)", "mail ada@example.com now")
print(named["user"], named["host"])</code></pre>
      <p><code>re.search</code> returns <code>None</code> when nothing matches, so check before using the result.</p>` },
    { type: "fill", prompt: py`<p>Find the phone number in the text. A number looks like three digits, a dash and four digits. It should print <code>['555-0142']</code>.</p>`,
      template: py`import re
text = "Call 555-0142 today"
print(re.___(r"___-\d{4}", text))
`, blanks: ["findall", "\\d{3}"], hint: ["findall returns every match as a list.", "\\d is a digit and {3} means exactly three of them."],
      tests: py`assert output.strip() == "['555-0142']"`, explain: "Patterns describe the shape of the text you want, rather than the exact characters." },
    { type: "order", prompt: py`<p>Write <code>year_of(text)</code> that returns the year (as an int) from text like <code>"born 1815-12-10"</code>, or <code>None</code>. One line is a trap.</p>`,
      lines: ["def year_of(text):", "    import re", "    m = re.search(r\"(\\d{4})-\\d{2}-\\d{2}\", text)", "    if m is None:", "        return None", "    return int(m.group(1))"], distractors: ["        return m.group(1)"],
      hint: ["Search first, then check whether anything was found.", "The first group (in brackets) is the year."],
      tests: py`assert year_of("born 1815-12-10") == 1815 and year_of("no date") is None and year_of("2024-03-09") == 2024`, explain: "Always check for None: search returns nothing when the pattern isn't found." },
    { type: "predict", code: py`import re
print(re.sub(r"\s+", " ", "too    many     spaces"))
print(bool(re.fullmatch(r"[a-z]+", "hello1")))`, answer: py`too many spaces
False` },
    { type: "code", mode: "fix", prompt: py`<p>This crashes when there are no digits. It should print <code>no match</code> in that case. Fix it.</p>`,
      starter: py`import re
m = re.search(r"\d+", "no digits here")
print(m.group())
`, solution: py`import re
m = re.search(r"\d+", "no digits here")
print(m.group() if m else "no match")
`, hint: ["Read the error: what is m?", "When nothing matches, search returns None, which has no .group(). Check before using it."],
      tests: py`assert output.strip() == "no match"`, explain: "search gives back either a match object or None, so test it before you ask for the group." },
    { type: "quiz", q: "What does re.findall(r\"\\d+\", \"a1b22c333\") return?", options: ["['1', '22', '333']", "['1', '2', '2', '3', '3', '3']", "'122333'", "[1, 22, 333]"], answer: 0, why: [null, "The + makes it take whole runs of digits, not one digit at a time.", "findall returns a list of matches, not a joined string.", "findall returns strings. You would convert with int() yourself."], explain: "\\d+ is greedy: each run of digits is one match, always returned as a string." },
    { type: "code", prompt: py`<p>Write <code>hashtags(text)</code> returning the list of hashtags in the text, without the <code>#</code>, in order. A hashtag is <code>#</code> followed by letters, digits or underscores.</p>`,
      starter: py`import re

def hashtags(text):
    pass
`, solution: py`import re

def hashtags(text):
    return re.findall(r"#(\w+)", text)`, hint: "findall returns just the captured group when the pattern has one set of parentheses.",
      tests: py`assert hashtags("Loving #python and #Code_2024!") == ["python", "Code_2024"]
assert hashtags("no tags here") == []
assert hashtags("#a#b") == ["a", "b"]` },
    { type: "code", prompt: py`<p>Write <code>parse_date(s)</code> for strings like <code>"2024-03-09"</code>, returning <code>(year, month, day)</code> as ints, or <code>None</code> if the string is not exactly in that shape.</p>`,
      starter: py`import re

def parse_date(s):
    pass
`, solution: py`import re

def parse_date(s):
    m = re.fullmatch(r"(\d{4})-(\d{2})-(\d{2})", s)
    if m is None:
        return None
    return tuple(int(part) for part in m.groups())`, hint: "fullmatch must match the whole string. Convert m.groups() to ints.",
      tests: py`assert parse_date("2024-03-09") == (2024, 3, 9)
assert parse_date("2024-3-9") is None
assert parse_date("on 2024-03-09") is None
assert parse_date("") is None` },
    { type: "code", boss: true, prompt: py`<p>Write <code>mask(text)</code> that replaces every run of <b>4 or more digits</b> with <code>"****"</code> (hiding card numbers and ids) but leaves shorter numbers alone.</p>`,
      starter: py`import re

def mask(text):
    pass
`, solution: py`import re

def mask(text):
    return re.sub(r"\d{4,}", "****", text)`, hint: "{4,} means four or more.",
      tests: py`assert mask("Card 4111111111111111 exp 12/29") == "Card **** exp 12/29"
assert mask("room 101") == "room 101"
assert mask("1234 and 123") == "**** and 123"` },
  ]},
  { id: "json", rev: 2, needs: ["dicts", "errors"], level: 2, title: "JSON & CSV", blurb: "Read and write the formats the web runs on", steps: [
    { type: "predict", probe: true, ask: "Before we start: what do you think this prints?", code: py`import json
print(json.dumps({"ok": True, "n": None}))`, answer: "{\"ok\": true, \"n\": null}", explain: "JSON has its own spelling: Python's True becomes true and None becomes null. dumps turns a Python value into JSON text." },
    { type: "learn", title: "JSON is dicts and lists as text", html: py`
      <p>Almost every web service sends data as <b>JSON</b>. It looks exactly like Python dicts, lists, strings, numbers and booleans. The <code>json</code> module converts both ways:</p>
      <pre data-try><code>import json
data = {"name": "Ada", "langs": ["python", "c"], "active": True, "boss": None}
text = json.dumps(data)
print(text)
back = json.loads(text)
print(back["langs"][0], back == data)
print(json.dumps(data, indent=2, sort_keys=True))</code></pre>
      <p>Notice <code>True</code> becomes <code>true</code> and <code>None</code> becomes <code>null</code>. Bad JSON raises <code>json.JSONDecodeError</code>, a kind of <code>ValueError</code>.</p>` },
    { type: "learn", title: "CSV is a table as text", html: py`
      <p><b>CSV</b> (comma separated values) is how spreadsheets export. <code>csv.DictReader</code> reads each row as a dict keyed by the header. In real programs you open a file; here we use <code>io.StringIO</code>, a string that behaves like a file.</p>
      <pre data-try><code>import csv, io
raw = "name,score\nAda,90\nBo,72\n"
rows = list(csv.DictReader(io.StringIO(raw)))
print(rows)
print(sum(int(r["score"]) for r in rows) / len(rows))</code></pre>
      <p>Everything in CSV is a string, so convert numbers yourself.</p>` },
    { type: "fill", prompt: py`<p>Turn the JSON text into Python data and print the first language. It should print <code>python</code>.</p>`,
      template: py`import json
data = json.___('{"name": "Ada", "langs": ["python", "c"]}')
print(data[___][0])
`, blanks: ["loads", "\"langs\""], hint: ["One function reads JSON text and returns Python data.", "data is a dict: use the key that holds the list."],
      tests: py`assert output.strip() == "python"`, explain: "loads (load from string) gives you ordinary dicts and lists to work with." },
    { type: "order", prompt: py`<p>Add up the <code>score</code> column of some CSV text. One line is a trap.</p>`,
      lines: ["def total_score(raw):", "    import csv, io", "    rows = csv.DictReader(io.StringIO(raw))", "    return sum(int(r[\"score\"]) for r in rows)"], distractors: ["return rows"],
      hint: ["Read the rows first, then add them up.", "CSV values are text, so convert each one with int()."],
      tests: py`assert total_score("name,score\nAda,90\nBo,72\n") == 162 and total_score("name,score\n") == 0`, explain: "DictReader gives each row as a dict keyed by the header, but every value is still a string." },
    { type: "code", mode: "fix", prompt: py`<p>This should print <code>Ada</code> but crashes. JSON is stricter than Python about its quotes. Fix it.</p>`,
      starter: py`import json
data = json.loads("{'name': 'Ada'}")
print(data["name"])
`, solution: py`import json
data = json.loads('{"name": "Ada"}')
print(data["name"])
`, hint: ["Read the error: where in the text does it fail?", "JSON requires double quotes around keys and strings. Swap the quotes around."],
      tests: py`assert output.strip() == "Ada"`, explain: "Python accepts single quotes but JSON never does: strings and keys need double quotes." },
    { type: "quiz", q: "json.loads('{\"n\": 1, \"ok\": true}')[\"ok\"] gives what?", options: ["The string 'true'", "True (a Python bool)", "An error because true is not Python", "1"], answer: 1, why: ["JSON booleans become real Python bools.", null, "json.loads translates JSON syntax for you.", "ok is true, not the number 1 (even though True == 1 in Python)."], explain: "loads maps true/false/null to True/False/None." },
    { type: "code", prompt: py`<p>Write <code>safe_load(text, default=None)</code> returning the parsed JSON, or <code>default</code> if the text is not valid JSON.</p>`,
      starter: py`import json

def safe_load(text, default=None):
    pass
`, solution: py`import json

def safe_load(text, default=None):
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        return default`, hint: "Wrap json.loads in try/except json.JSONDecodeError.",
      tests: py`assert safe_load('{"a": [1, 2]}') == {"a": [1, 2]}
assert safe_load("{oops", default={}) == {}
assert safe_load("") is None
assert safe_load("0") == 0, "a valid falsy value must not be replaced by the default"` },
    { type: "code", prompt: py`<p>Write <code>average_by_team(raw)</code>. <code>raw</code> is CSV text with a header <code>team,points</code>. Return a dict of team to average points, rounded to 1 decimal.</p>`,
      starter: py`import csv, io

def average_by_team(raw):
    pass
`, solution: py`import csv, io

def average_by_team(raw):
    totals = {}
    for row in csv.DictReader(io.StringIO(raw)):
        totals.setdefault(row["team"], []).append(int(row["points"]))
    return {team: round(sum(p) / len(p), 1) for team, p in totals.items()}`, hint: "Group the points per team in lists first, then average each list.",
      tests: py`raw = "team,points\nred,10\nblue,7\nred,5\nblue,8\nblue,6\n"
assert average_by_team(raw) == {"red": 7.5, "blue": 7.0}
assert average_by_team("team,points\n") == {}` },
    { type: "code", boss: true, prompt: py`<p>Write <code>to_json(rows)</code>: turn a list of dicts into pretty JSON text with keys sorted and 2-space indentation.</p>`,
      starter: py`import json

def to_json(rows):
    pass
`, solution: py`import json

def to_json(rows):
    return json.dumps(rows, indent=2, sort_keys=True)`, hint: "json.dumps takes indent= and sort_keys=.",
      tests: py`assert to_json([{"b": 1, "a": 2}]) == '[\n  {\n    "a": 2,\n    "b": 1\n  }\n]'
import json
assert json.loads(to_json([{"x": [1, 2]}])) == [{"x": [1, 2]}]` },
  ]},
  { id: "csvreport", kind: "project", needs: ["json", "wordfreq"], level: 2, title: "Mini: Sales Report", blurb: "Turn raw CSV sales data into a clean report", steps: [
    { type: "learn", title: "From raw data to a report", html: py`
      <p>Data work is mostly: <b>read, clean, group, summarise, print</b>. You will build a report from CSV text where each line is <code>product,qty,price</code>:</p>
      <pre data-try><code>raw = """product,qty,price
pen,10,1.5
book,2,12
pen,5,1.5
"""
print(raw.splitlines()[1].split(","))</code></pre>
      <p>You will reuse <code>csv</code>, dict grouping and sorting from earlier lessons.</p>` },
    { type: "code", prompt: py`<p><b>Piece 1.</b> Write <code>load(raw)</code> returning a list of dicts with <code>product</code> (str), <code>qty</code> (int) and <code>price</code> (float). Skip rows whose qty is not a whole number (bad data happens).</p>`,
      starter: py`import csv, io

def load(raw):
    pass
`, solution: py`import csv, io

def load(raw):
    rows = []
    for r in csv.DictReader(io.StringIO(raw)):
        try:
            qty = int(r["qty"])
        except ValueError:
            continue
        rows.append({"product": r["product"], "qty": qty, "price": float(r["price"])})
    return rows`, hint: "Try int(r['qty']) inside try/except ValueError and 'continue' on failure.",
      tests: py`raw = "product,qty,price\npen,10,1.5\nbook,two,12\nbook,2,12\n"
assert load(raw) == [{"product": "pen", "qty": 10, "price": 1.5}, {"product": "book", "qty": 2, "price": 12.0}]` },
    { type: "code", prompt: py`<p><b>Piece 2.</b> Write <code>revenue(rows)</code> returning a dict of product to total revenue (<code>qty * price</code> summed), rounded to 2 decimals.</p>`,
      starter: py`def revenue(rows):
    pass
`, solution: py`def revenue(rows):
    totals = {}
    for r in rows:
        totals[r["product"]] = totals.get(r["product"], 0) + r["qty"] * r["price"]
    return {p: round(v, 2) for p, v in totals.items()}`, hint: "Accumulate qty * price per product, then round at the end.",
      tests: py`rows = [{"product": "pen", "qty": 10, "price": 1.5}, {"product": "book", "qty": 2, "price": 12.0}, {"product": "pen", "qty": 5, "price": 1.5}]
assert revenue(rows) == {"pen": 22.5, "book": 24.0}
assert revenue([]) == {}` },
    { type: "code", prompt: py`<p><b>Piece 3.</b> Write <code>report(revenue_by_product)</code> returning text: one line per product, best revenue first (ties alphabetical), formatted <code>"book   24.00"</code> where the name is left-aligned in 6 characters and the amount has 2 decimals, then a final line <code>"TOTAL  46.50"</code>.</p>`,
      starter: py`def report(rev):
    pass
`, solution: py`def report(rev):
    ranked = sorted(rev.items(), key=lambda kv: (-kv[1], kv[0]))
    lines = [f"{name:<6} {value:.2f}" for name, value in ranked]
    lines.append(f"{'TOTAL':<6} {sum(rev.values()):.2f}")
    return "\n".join(lines)`, hint: "f\"{name:<6} {value:.2f}\" pads the name to 6 characters.",
      tests: py`assert report({"pen": 22.5, "book": 24.0}) == "book   24.00\npen    22.50\nTOTAL  46.50"
assert report({}) == "TOTAL  0.00"` },
  ]},
  { id: "loganalyzer", kind: "project", needs: ["regex", "json"], level: 3, title: "Mini: Log Analyzer", blurb: "Parse server logs with regex and find what went wrong", steps: [
    { type: "learn", title: "Reading a server log", html: py`
      <p>Engineers spend a lot of time reading logs. Each line has a shape you can capture with a regex:</p>
      <pre data-try><code>import re
line = "2024-05-01 12:30:05 ERROR payments Card declined (code 51)"
m = re.match(r"(\S+) (\S+) (\w+) (\w+) (.*)", line)
print(m.groups())</code></pre>
      <p>You will turn raw text into data, count problems per service and find the busiest minute.</p>` },
    { type: "code", prompt: py`<p><b>Piece 1.</b> Write <code>parse(line)</code> returning a dict with keys <code>date</code>, <code>time</code>, <code>level</code>, <code>service</code> and <code>message</code>, or <code>None</code> if the line does not fit the shape <code>DATE TIME LEVEL service message</code> (LEVEL is upper case letters).</p>`,
      starter: py`import re

def parse(line):
    pass
`, solution: py`import re

PATTERN = re.compile(r"(\d{4}-\d{2}-\d{2}) (\d{2}:\d{2}:\d{2}) ([A-Z]+) (\w+) (.*)")

def parse(line):
    m = PATTERN.fullmatch(line.strip())
    if m is None:
        return None
    keys = ("date", "time", "level", "service", "message")
    return dict(zip(keys, m.groups()))`, hint: "fullmatch with five groups; zip the group tuple with the key names.",
      tests: py`r = parse("2024-05-01 12:30:05 ERROR payments Card declined (code 51)")
assert r == {"date": "2024-05-01", "time": "12:30:05", "level": "ERROR", "service": "payments", "message": "Card declined (code 51)"}
assert parse("garbage line") is None
assert parse("") is None` },
    { type: "code", prompt: py`<p><b>Piece 2.</b> Write <code>errors_by_service(lines)</code> returning a dict of service to the number of <code>ERROR</code> lines. Lines that do not parse are ignored.</p>`,
      starter: py`import re

PATTERN = re.compile(r"(\d{4}-\d{2}-\d{2}) (\d{2}:\d{2}:\d{2}) ([A-Z]+) (\w+) (.*)")

def parse(line):
    m = PATTERN.fullmatch(line.strip())
    if m is None:
        return None
    keys = ("date", "time", "level", "service", "message")
    return dict(zip(keys, m.groups()))

def errors_by_service(lines):
    pass
`, solution: py`import re

PATTERN = re.compile(r"(\d{4}-\d{2}-\d{2}) (\d{2}:\d{2}:\d{2}) ([A-Z]+) (\w+) (.*)")

def parse(line):
    m = PATTERN.fullmatch(line.strip())
    if m is None:
        return None
    keys = ("date", "time", "level", "service", "message")
    return dict(zip(keys, m.groups()))

def errors_by_service(lines):
    counts = {}
    for line in lines:
        entry = parse(line)
        if entry and entry["level"] == "ERROR":
            counts[entry["service"]] = counts.get(entry["service"], 0) + 1
    return counts`, hint: "parse each line, skip None, count only level == 'ERROR'.",
      tests: py`log = """2024-05-01 12:30:05 ERROR payments declined
2024-05-01 12:30:09 INFO web page served
2024-05-01 12:31:00 ERROR payments timeout
oops not a log line
2024-05-01 12:31:30 ERROR web crash""".splitlines()
assert errors_by_service(log) == {"payments": 2, "web": 1}
assert errors_by_service([]) == {}` },
    { type: "code", prompt: py`<p><b>Piece 3.</b> Write <code>busiest_minute(lines)</code> returning the minute <code>"12:30"</code> (HH:MM) with the most log lines, or <code>None</code> for an empty log. On a tie return the earliest minute. Unparseable lines are ignored.</p>`,
      starter: py`import re

PATTERN = re.compile(r"(\d{4}-\d{2}-\d{2}) (\d{2}:\d{2}):\d{2} ([A-Z]+) (\w+) (.*)")

def busiest_minute(lines):
    pass
`, solution: py`import re

PATTERN = re.compile(r"(\d{4}-\d{2}-\d{2}) (\d{2}:\d{2}):\d{2} ([A-Z]+) (\w+) (.*)")

def busiest_minute(lines):
    per_minute = {}
    for line in lines:
        m = PATTERN.fullmatch(line.strip())
        if m:
            per_minute[m.group(2)] = per_minute.get(m.group(2), 0) + 1
    if not per_minute:
        return None
    return min(per_minute, key=lambda minute: (-per_minute[minute], minute))`, hint: "Count per minute, then pick with min(..., key=lambda m: (-count, m)).",
      tests: py`log = ["2024-05-01 12:31:00 INFO a x", "2024-05-01 12:30:05 INFO a y", "2024-05-01 12:31:30 ERROR b z", "2024-05-01 12:30:59 INFO a q", "bad"]
assert busiest_minute(log) == "12:30", "tie between 12:30 and 12:31 goes to the earliest"
assert busiest_minute(log[:1] + log[2:3]) == "12:31"
assert busiest_minute([]) is None
assert busiest_minute(["nope"]) is None` },
  ]},
  ]
},
{
  id: "tools", title: "Pythonic Tools", desc: "Collections, itertools, decorators and dataclasses", color: "pink",
  lessons: [
  { id: "itertools", rev: 2, needs: ["dicts", "comprehensions", "modules"], level: 3, title: "Collections & Itertools", blurb: "Counter, defaultdict, zip, combinations and friends", steps: [
    { type: "predict", probe: true, ask: "Before we start: what do you think this prints?", code: py`from itertools import combinations
print(list(combinations("abc", 2)))`, answer: "[('a', 'b'), ('a', 'c'), ('b', 'c')]", explain: "combinations lists every way to pick 2 letters when order doesn't matter, each pair once. ('a', 'b') and ('b', 'a') would be the same pair, so only one appears." },
    { type: "learn", title: "Batteries included", html: py`
      <p>Python ships tools for jobs you would otherwise write by hand. <code>collections.Counter</code> counts, and <code>defaultdict</code> creates missing entries for you:</p>
      <pre data-try><code>from collections import Counter, defaultdict
print(Counter("mississippi").most_common(2))

groups = defaultdict(list)
for word in ["ant", "bee", "ape", "bat"]:
    groups[word[0]].append(word)
print(dict(groups))</code></pre>` },
    { type: "learn", title: "Looping and combining", html: py`
      <p><code>itertools</code> builds loops without writing them. All results are lazy, wrap them in <code>list()</code> to see them.</p>
      <pre data-try><code>from itertools import combinations, permutations, product, chain, accumulate
print(list(combinations("abc", 2)))
print(list(permutations([1, 2, 3], 2))[:3])
print(list(product("ab", [1, 2])))
print(list(chain([1, 2], [3])))
print(list(accumulate([1, 2, 3, 4])))
print(list(zip("abc", [10, 20, 30])), list(enumerate("xy", start=1)))</code></pre>` },
    { type: "fill", prompt: py`<p>Pair the numbers with the letters, then keep a running total. It should print <code>[(1, 'a'), (2, 'b'), (3, 'c')]</code> and then <code>[1, 3, 6, 10]</code>.</p>`,
      template: py`from itertools import accumulate
print(list(___([1, 2, 3], ["a", "b", "c"])))
print(list(___([1, 2, 3, 4])))
`, blanks: ["zip", "accumulate"], hint: ["One built-in walks through several lists side by side.", "accumulate gives the running total after each item."],
      tests: py`assert output.split("\n")[:2] == ["[(1, 'a'), (2, 'b'), (3, 'c')]", "[1, 3, 6, 10]"]`, explain: "These tools turn loops you would write by hand into one readable line." },
    { type: "order", prompt: py`<p>Write <code>pairs(items)</code> returning every unordered pair of items. One line is a trap.</p>`,
      lines: ["def pairs(items):", "    from itertools import combinations", "    return list(combinations(items, 2))"], distractors: ["return list(items)"],
      hint: ["Import the tool first, then use it.", "Wrap the result in list() to see the pairs."],
      tests: py`assert pairs([1, 2, 3]) == [(1, 2), (1, 3), (2, 3)] and pairs([1]) == [] and pairs([]) == []`, explain: "itertools functions are lazy: they only produce values when you ask, which is why list() is needed." },
    { type: "code", mode: "fix", prompt: py`<p>How many handshakes happen if 4 people each shake hands with every other person once? It should print <code>6</code> but prints something else. Fix it.</p>`,
      starter: py`from itertools import permutations
handshakes = len(list(permutations(range(4), 2)))
print(handshakes)
`, solution: py`from itertools import combinations
handshakes = len(list(combinations(range(4), 2)))
print(handshakes)
`, hint: ["A handshake between A and B is the same as between B and A.", "permutations counts both orders. You want pairs where order doesn't matter."],
      tests: py`assert output.strip() == "6"`, explain: "permutations: order matters (A,B and B,A differ). combinations: order doesn't matter." },
    { type: "quiz", q: "How many items are in list(combinations(range(5), 2))?", options: ["25", "20", "10", "5"], answer: 2, why: ["25 would be product(range(5), repeat=2): order matters and repeats are allowed.", "20 is permutations(range(5), 2): order matters.", null, "That is just the input length."], explain: "Choose 2 of 5 with no order and no repeats: 5*4/2 = 10." },
    { type: "code", prompt: py`<p>Write <code>anagram_groups(words)</code> returning a list of groups (lists) of words that are anagrams of each other, only groups with 2+ words. Keep words in input order within a group and sort the groups by their first word. Use <code>defaultdict</code>.</p>`,
      starter: py`from collections import defaultdict

def anagram_groups(words):
    pass
`, solution: py`from collections import defaultdict

def anagram_groups(words):
    groups = defaultdict(list)
    for w in words:
        groups["".join(sorted(w))].append(w)
    return sorted((g for g in groups.values() if len(g) > 1), key=lambda g: g[0])`, hint: "sorted(word) as a key groups anagrams: 'listen' and 'silent' share it.",
      tests: py`w = ["listen", "google", "silent", "enlist", "cat", "act", "dog"]
assert anagram_groups(w) == [["cat", "act"], ["listen", "silent", "enlist"]]
assert anagram_groups(["a", "b"]) == []` },
    { type: "code", prompt: py`<p>Write <code>pairs_with_sum(nums, target)</code> returning every pair <code>(a, b)</code> of values from different positions (combinations, positions i &lt; j) whose sum is <code>target</code>, in the order <code>combinations</code> produces them.</p>`,
      starter: py`from itertools import combinations

def pairs_with_sum(nums, target):
    pass
`, solution: py`from itertools import combinations

def pairs_with_sum(nums, target):
    return [(a, b) for a, b in combinations(nums, 2) if a + b == target]`, hint: "combinations(nums, 2) gives each pair of positions once.",
      tests: py`assert pairs_with_sum([1, 4, 5, 6, 3], 9) == [(4, 5), (6, 3)]
assert pairs_with_sum([2, 2, 2], 4) == [(2, 2), (2, 2), (2, 2)]
assert pairs_with_sum([1], 2) == []` },
    { type: "code", boss: true, prompt: py`<p>Write <code>running_best(scores)</code> returning, for each position, the highest score seen so far. Use <code>itertools.accumulate</code> with <code>max</code>. <code>running_best([3, 1, 4, 1, 5])</code> is <code>[3, 3, 4, 4, 5]</code>.</p>`,
      starter: py`from itertools import accumulate

def running_best(scores):
    pass
`, solution: py`from itertools import accumulate

def running_best(scores):
    return list(accumulate(scores, max))`, hint: "accumulate(iterable, func) applies func to the running result and the next item.",
      tests: py`assert running_best([3, 1, 4, 1, 5]) == [3, 3, 4, 4, 5]
assert running_best([]) == []` },
  ]},
  { id: "decorators", rev: 2, needs: ["funcdepth", "modules", "itertools"], level: 4, title: "Decorators", blurb: "Wrap functions to add behaviour without touching them", steps: [
    { type: "predict", probe: true, ask: "Before we start: what do you think this prints?", code: py`def bold(fn):
    def wrapper():
        return "<b>" + fn() + "</b>"
    return wrapper

@bold
def hello():
    return "hi"

print(hello())`, answer: "<b>hi</b>", explain: "@bold means hello = bold(hello). The name hello now points to wrapper, which calls the original and wraps its result in tags." },
    { type: "learn", title: "Functions are values", html: py`
      <p>In Python a function can be passed around, returned, and stored. A <b>decorator</b> is a function that takes a function and returns an improved one:</p>
      <pre data-try><code>def shout(fn):
    def wrapper(*args, **kwargs):
        return fn(*args, **kwargs).upper() + "!"
    return wrapper

@shout
def greet(name):
    return "hello " + name

print(greet("ada"))</code></pre>
      <p><code>@shout</code> above <code>def greet</code> is exactly <code>greet = shout(greet)</code>. <code>*args, **kwargs</code> let the wrapper accept whatever the original accepts.</p>` },
    { type: "learn", title: "Keep the name, add a parameter", html: py`
      <p>Wrappers hide the original name. <code>functools.wraps</code> copies it back. A decorator with its own argument is one more layer:</p>
      <pre data-try><code>import functools

def repeat(times):
    def decorator(fn):
        @functools.wraps(fn)
        def wrapper(*args, **kwargs):
            result = None
            for _ in range(times):
                result = fn(*args, **kwargs)
            return result
        return wrapper
    return decorator

@repeat(3)
def hi():
    print("hi")

hi()
print(hi.__name__)</code></pre>` },
    { type: "fill", prompt: py`<p>Complete the decorator so <code>greet("ada")</code> gives <code>HELLO ADA</code>.</p>`,
      template: py`def shout(fn):
    def wrapper(name):
        return fn(___).upper()
    return ___

@shout
def greet(name):
    return "hello " + name

print(greet("ada"))
`, blanks: ["name", "wrapper"], hint: ["The wrapper forwards its argument to the original function.", "A decorator hands back the new function (without calling it)."],
      tests: py`assert output.strip() == "HELLO ADA"`, explain: "A decorator takes a function and returns a replacement for it." },
    { type: "predict", code: py`def twice(fn):
    def wrapper(x):
        return fn(fn(x))
    return wrapper

@twice
def add3(x):
    return x + 3

print(add3(10))`, answer: py`16` },
    { type: "order", prompt: py`<p>Write a decorator <code>logged</code> that prints <code>calling NAME</code> before running the function. One line is a trap.</p>`,
      lines: ["def logged(fn):", "    import functools", "    @functools.wraps(fn)", "    def wrapper(*args, **kwargs):", "        print(\"calling\", fn.__name__)", "        return fn(*args, **kwargs)", "    return wrapper"], distractors: ["        return fn"],
      hint: ["The wrapper sits inside the decorator.", "The decorator returns the wrapper at the very end."],
      tests: py`import io, contextlib
@logged
def add(a, b):
    return a + b
buf = io.StringIO()
with contextlib.redirect_stdout(buf):
    r = add(1, 2)
assert r == 3 and buf.getvalue().strip() == "calling add" and add.__name__ == "add"`, explain: "functools.wraps keeps the original name and docstring on the wrapper." },
    { type: "code", mode: "fix", prompt: py`<p><code>hello()</code> should print <code>HI!</code> but prints <code>None</code>. Fix the decorator.</p>`,
      starter: py`def loud(fn):
    def wrapper():
        fn().upper() + "!"
    return wrapper

@loud
def hello():
    return "hi"

print(hello())
`, solution: py`def loud(fn):
    def wrapper():
        return fn().upper() + "!"
    return wrapper

@loud
def hello():
    return "hi"

print(hello())
`, hint: ["The wrapper computes something. Does it hand it back?", "A wrapper without return gives back None. Return the result."],
      tests: py`assert output.strip() == "HI!"`, explain: "The wrapper replaces the function, so it has to return the value for the caller." },
    { type: "quiz", q: "Why does a decorator's wrapper usually take (*args, **kwargs)?", options: ["Python requires it", "So the wrapper works for functions with any parameters", "To make the function faster", "To hide errors"], answer: 1, why: ["It is a convention, not a rule.", null, "It adds a tiny bit of overhead instead.", "Errors still propagate normally."], explain: "The wrapper forwards whatever it receives to the original." },
    { type: "code", prompt: py`<p>Write a decorator <code>count_calls</code>. The decorated function must still work normally, and expose how many times it ran as the attribute <code>.calls</code> (starting at 0).</p>`,
      starter: py`import functools

def count_calls(fn):
    pass
`, solution: py`import functools

def count_calls(fn):
    @functools.wraps(fn)
    def wrapper(*args, **kwargs):
        wrapper.calls += 1
        return fn(*args, **kwargs)
    wrapper.calls = 0
    return wrapper`, hint: "Functions can have attributes. Increment wrapper.calls inside wrapper and set it to 0 before returning.",
      tests: py`@count_calls
def add(a, b=0):
    "adds"
    return a + b

assert add.calls == 0
assert add(1, b=2) == 3 and add(5) == 5
assert add.calls == 2
assert add.__name__ == "add", "use functools.wraps"` },
    { type: "code", boss: true, prompt: py`<p>Write <code>retry(times)</code>: a decorator factory. The decorated function is called up to <code>times</code> times; if it raises <code>ValueError</code> it tries again, and if every attempt fails the last <code>ValueError</code> is raised.</p>`,
      starter: py`import functools

def retry(times):
    pass
`, solution: py`import functools

def retry(times):
    def decorator(fn):
        @functools.wraps(fn)
        def wrapper(*args, **kwargs):
            for attempt in range(times):
                try:
                    return fn(*args, **kwargs)
                except ValueError:
                    if attempt == times - 1:
                        raise
        return wrapper
    return decorator`, hint: "Three layers: retry(times) returns decorator(fn) returns wrapper(...). Re-raise on the last attempt.",
      tests: py`state = {"n": 0}

@retry(3)
def flaky():
    state["n"] += 1
    if state["n"] < 3:
        raise ValueError("not yet")
    return "ok"

assert flaky() == "ok" and state["n"] == 3

@retry(2)
def broken():
    raise ValueError("always")

try:
    broken()
except ValueError:
    pass
else:
    raise AssertionError("should give up with ValueError")` },
  ]},
  { id: "dataclasses", rev: 2, needs: ["classes", "tuples", "dunder"], level: 3, title: "Dataclasses & Type Hints", blurb: "Classes that write their own boilerplate", steps: [
    { type: "predict", probe: true, ask: "Before we start: what do you think this prints?", code: py`from dataclasses import dataclass

@dataclass
class Point:
    x: int
    y: int = 0

print(Point(3))`, answer: "Point(x=3, y=0)", explain: "@dataclass wrote __init__ and __repr__ from the type hints. The default y=0 is used since only x was given, and printing shows all the fields." },
    { type: "learn", title: "Less boilerplate", html: py`
      <p>Many classes just hold data. Writing <code>__init__</code>, <code>__repr__</code> and <code>__eq__</code> by hand is tedious. <code>@dataclass</code> writes them from <b>type hints</b>:</p>
      <pre data-try><code>from dataclasses import dataclass, field

@dataclass
class Player:
    name: str
    score: int = 0
    items: list = field(default_factory=list)

p = Player("Ada")
p.score += 10
print(p)
print(p == Player("Ada", 10))</code></pre>
      <p>A mutable default (like a list) needs <code>field(default_factory=list)</code>, otherwise every instance would share one list.</p>` },
    { type: "learn", title: "Frozen, ordered, and hints", html: py`
      <p><code>@dataclass(frozen=True)</code> makes instances immutable (and hashable, so usable in sets and as dict keys). <code>order=True</code> adds <code>&lt;</code> and <code>&gt;</code> comparing fields in order. Hints document intent; Python itself does not enforce them (tools like mypy do).</p>
      <pre data-try><code>from dataclasses import dataclass

@dataclass(frozen=True, order=True)
class Version:
    major: int
    minor: int = 0

print(Version(1, 2) < Version(1, 10))
print(max([Version(1, 2), Version(2), Version(1, 9)]))
print({Version(1): "old"})

def double(x: int) -> int:
    return x * 2
print(double(4))</code></pre>` },
    { type: "fill", prompt: py`<p>Complete the dataclass. The score should default to <code>0</code>, and the program prints that default.</p>`,
      template: py`from dataclasses import ___

@dataclass
class Player:
    name: str
    score: ___ = 0

print(Player("Ada").score)
`, blanks: ["dataclass", "int"], hint: ["The decorator has the same name as the module it comes from.", "A field's type hint goes after the colon. A score is a whole number."],
      tests: py`assert output.strip() == "0"`, explain: "A dataclass is just a normal class where the boring parts are written for you." },
    { type: "order", prompt: py`<p>Make an immutable <code>Coord</code> with <code>lat</code> and <code>lon</code>. One line is a trap.</p>`,
      lines: ["from dataclasses import dataclass", "@dataclass(frozen=True)", "class Coord:", "    lat: float", "    lon: float"], distractors: ["@dataclass(order=True)"],
      hint: ["The import comes first, then the decorator, then the class.", "frozen=True makes the objects unchangeable."],
      tests: py`c = Coord(1.0, 2.0)
assert c.lat == 1.0 and c == Coord(1.0, 2.0) and len({c, Coord(1.0, 2.0)}) == 1
try:
    c.lat = 5
except Exception:
    pass
else:
    raise AssertionError("Coord must be frozen")`, explain: "A frozen dataclass can't change after creation, which also makes it hashable." },
    { type: "code", mode: "fix", prompt: py`<p>This crashes with a <code>ValueError</code> at the class definition. Give each team its own list. It should print <code>Team(name='A', members=[])</code>.</p>`,
      starter: py`from dataclasses import dataclass

@dataclass
class Team:
    name: str
    members: list = []

print(Team("A"))
`, solution: py`from dataclasses import dataclass, field

@dataclass
class Team:
    name: str
    members: list = field(default_factory=list)

print(Team("A"))
`, hint: ["Read the error: it names the problem with the default.", "A list default would be shared by all teams. Use field(default_factory=list)."],
      tests: py`assert output.strip() == "Team(name='A', members=[])"
a, b = Team("A"), Team("B")
a.members.append(1)
assert b.members == []`, explain: "default_factory makes a new list for every object, so teams don't share members." },
    { type: "quiz", q: "Why does a dataclass field with a list default need field(default_factory=list)?", options: ["Lists are not allowed as fields", "One shared list would be reused by every instance", "It makes the list read-only", "It is faster"], answer: 1, why: ["Lists are fine as a field type.", null, "It does not change mutability.", "Speed is not the reason."], explain: "A default is evaluated once. default_factory builds a fresh list per instance." },
    { type: "code", prompt: py`<p>Write a dataclass <code>Item</code> with fields <code>name: str</code>, <code>price: float</code> and <code>qty: int = 1</code>, plus a method <code>total()</code> returning <code>price * qty</code>.</p>`,
      starter: py`from dataclasses import dataclass

# write the class
`, solution: py`from dataclasses import dataclass

@dataclass
class Item:
    name: str
    price: float
    qty: int = 1

    def total(self):
        return self.price * self.qty`, hint: "Decorate with @dataclass, list the fields with hints, then add the method.",
      tests: py`i = Item("pen", 1.5, 4)
assert i.total() == 6.0 and Item("book", 10).qty == 1
assert Item("a", 1) == Item("a", 1) and "Item(name='a'" in repr(Item("a", 1))` },
    { type: "code", boss: true, prompt: py`<p>Write a frozen, ordered dataclass <code>Card</code> with <code>rank: int</code> and <code>suit: str</code>, so that <code>sorted(cards)</code> orders by rank, then suit. Then write <code>best(cards)</code> returning the highest card.</p>`,
      starter: py`from dataclasses import dataclass

# write Card and best
`, solution: py`from dataclasses import dataclass

@dataclass(frozen=True, order=True)
class Card:
    rank: int
    suit: str

def best(cards):
    return max(cards)`, hint: "order=True compares fields in the order they are declared.",
      tests: py`hand = [Card(10, "h"), Card(12, "c"), Card(10, "s")]
assert sorted(hand) == [Card(10, "h"), Card(10, "s"), Card(12, "c")]
assert best(hand) == Card(12, "c")
try:
    hand[0].rank = 3
except Exception:
    pass
else:
    raise AssertionError("Card must be frozen")
assert len({Card(1, "a"), Card(1, "a")}) == 1` },
  ]},
  { id: "timer", kind: "project", needs: ["decorators"], level: 4, title: "Mini: Decorator Toolkit", blurb: "Build a cache, a logger and a validator you can reuse", steps: [
    { type: "learn", title: "Your own toolbox", html: py`
      <p>Professional codebases are full of small decorators: caching, logging, access checks. You will build three, each in a few lines, and stack them.</p>
      <pre data-try><code>import functools

def logged(fn):
    @functools.wraps(fn)
    def wrapper(*args, **kwargs):
        print("calling", fn.__name__, args)
        return fn(*args, **kwargs)
    return wrapper

@logged
def add(a, b):
    return a + b

print(add(2, 3))</code></pre>` },
    { type: "code", prompt: py`<p><b>Piece 1: cache.</b> Write <code>cache</code>: remember results by arguments (positional only is fine) so a repeated call returns the stored answer without running the function again. Add <code>.hits</code> counting how often the cache answered.</p>`,
      starter: py`import functools

def cache(fn):
    pass
`, solution: py`import functools

def cache(fn):
    store = {}

    @functools.wraps(fn)
    def wrapper(*args):
        if args in store:
            wrapper.hits += 1
            return store[args]
        store[args] = fn(*args)
        return store[args]

    wrapper.hits = 0
    return wrapper`, hint: "Use the args tuple as a dict key. Check 'args in store' first.",
      tests: py`ran = []

@cache
def slow_square(n):
    ran.append(n)
    return n * n

assert slow_square(4) == 16 and slow_square(4) == 16 and slow_square(5) == 25
assert ran == [4, 5], "the function must run once per distinct argument"
assert slow_square.hits == 1

@cache
def fib(n):
    return n if n < 2 else fib(n - 1) + fib(n - 2)

assert fib(80) == 23416728348467685, "a cache makes recursive fib instant"` },
    { type: "code", prompt: py`<p><b>Piece 2: validator.</b> Write <code>positive_args</code>: before calling, check that every positional argument is a number greater than 0, otherwise raise <code>ValueError("arguments must be positive")</code>.</p>`,
      starter: py`import functools

def positive_args(fn):
    pass
`, solution: py`import functools

def positive_args(fn):
    @functools.wraps(fn)
    def wrapper(*args):
        if any(not isinstance(a, (int, float)) or a <= 0 for a in args):
            raise ValueError("arguments must be positive")
        return fn(*args)
    return wrapper`, hint: "any(...) over the args with a condition for 'not a number or <= 0'.",
      tests: py`@positive_args
def area(w, h):
    return w * h

assert area(2, 3) == 6
for bad in ((0, 3), (-1, 2), ("a", 2)):
    try:
        area(*bad)
    except ValueError as e:
        assert "positive" in str(e)
    else:
        raise AssertionError(f"{bad} should be rejected")` },
    { type: "code", prompt: py`<p><b>Piece 3: stack them.</b> Write <code>make_area()</code> that returns a function <code>area(w, h)</code> (returns <code>w * h</code>) decorated with both <code>positive_args</code> (outer) and <code>cache</code> (inner). Both decorators are provided.</p>`,
      starter: py`import functools

def cache(fn):
    store = {}

    @functools.wraps(fn)
    def wrapper(*args):
        if args in store:
            wrapper.hits += 1
            return store[args]
        store[args] = fn(*args)
        return store[args]

    wrapper.hits = 0
    return wrapper

def positive_args(fn):
    @functools.wraps(fn)
    def wrapper(*args):
        if any(not isinstance(a, (int, float)) or a <= 0 for a in args):
            raise ValueError("arguments must be positive")
        return fn(*args)
    return wrapper

def make_area():
    pass
`, solution: py`import functools

def cache(fn):
    store = {}

    @functools.wraps(fn)
    def wrapper(*args):
        if args in store:
            wrapper.hits += 1
            return store[args]
        store[args] = fn(*args)
        return store[args]

    wrapper.hits = 0
    return wrapper

def positive_args(fn):
    @functools.wraps(fn)
    def wrapper(*args):
        if any(not isinstance(a, (int, float)) or a <= 0 for a in args):
            raise ValueError("arguments must be positive")
        return fn(*args)
    return wrapper

def make_area():
    @positive_args
    @cache
    def area(w, h):
        return w * h
    return area`, hint: "Decorators apply bottom-up: the one nearest def wraps first.",
      tests: py`area = make_area()
assert area(2, 3) == 6 and area(2, 3) == 6
try:
    area(-1, 3)
except ValueError:
    pass
else:
    raise AssertionError("validation should run first")` },
  ]},
  ]
},
{
  id: "solving", title: "Problem Solving", desc: "Patterns that crack coding puzzles", color: "teal",
  lessons: [
  { id: "twopointers", rev: 2, needs: ["linear", "sorting"], level: 3, title: "Two Pointers", blurb: "Walk a list from both ends instead of nesting loops", steps: [
    { type: "predict", probe: true, ask: "Before we start: what do you think this prints?", code: py`nums = [1, 3, 4, 6, 9]
lo, hi = 0, len(nums) - 1
print(nums[lo] + nums[hi])
lo += 1
hi -= 1
print(nums[lo] + nums[hi])`, answer: py`10
9`, explain: "One pointer starts at each end: 1 + 9 = 10. After moving both inward the pair is 3 + 6 = 9. Each move uses sorted order to discard an end." },
    { type: "learn", title: "Two fingers on the list", html: py`
      <p>Many puzzles that look like they need two nested loops (O(n²)) can be solved in a single pass with <b>two pointers</b>. On a <i>sorted</i> list put one at each end and move them toward each other:</p>
      <pre data-try><code>nums = [1, 3, 4, 6, 9, 11]
target = 10
lo, hi = 0, len(nums) - 1
while lo < hi:
    s = nums[lo] + nums[hi]
    print(lo, hi, s)
    if s == target:
        break
    if s < target:
        lo += 1
    else:
        hi -= 1</code></pre>
      <p>Too small? Move the left pointer up for a bigger sum. Too big? Move the right pointer down. Each step discards one element for good.</p>` },
    { type: "fill", prompt: py`<p>Finish the two-pointer search: if the sum is too small, move the left pointer up; if too big, move the right pointer down.</p>`,
      template: py`def pair_sum(nums, target):
    lo, hi = 0, len(nums) - 1
    while lo < hi:
        s = nums[lo] + nums[hi]
        if s == target:
            return lo, hi
        if s < target:
            lo += ___
        else:
            hi ___ 1
    return None
`, blanks: ["1", "-="], hint: ["A sum that is too small needs a bigger left number.", "A sum that is too big needs a smaller right number: the pointer moves down."],
      tests: py`assert pair_sum([1, 3, 4, 6, 9], 10) == (0, 4) and pair_sum([1, 2, 3], 100) is None and pair_sum([5], 10) is None`, explain: "Each step discards one end for good, so the whole search is O(n)." },
    { type: "order", prompt: py`<p>Check whether a word is a palindrome by comparing from both ends. One line is a trap.</p>`,
      lines: ["def is_pal(s):", "    i, j = 0, len(s) - 1", "    while i < j:", "        if s[i] != s[j]:", "            return False", "        i += 1", "        j -= 1", "    return True"], distractors: ["        return True"],
      hint: ["Pointers start at the two ends and move toward the middle.", "Return False at the first mismatch, True only after the loop."],
      tests: py`assert is_pal("racecar") and is_pal("") and is_pal("a") and not is_pal("hello") and not is_pal("ab")`, explain: "Two pointers walking toward each other is the cleanest way to compare a sequence with its mirror." },
    { type: "code", mode: "fix", prompt: py`<p>For the sorted list <code>[1, 3, 4, 6, 9]</code> and target <code>7</code> this should print <code>(0, 3)</code>, but prints <code>None</code>. The pointers move the wrong way. Fix it.</p>`,
      starter: py`def pair_sum(nums, target):
    lo, hi = 0, len(nums) - 1
    while lo < hi:
        s = nums[lo] + nums[hi]
        if s == target:
            return lo, hi
        if s < target:
            hi -= 1
        else:
            lo += 1
    return None

print(pair_sum([1, 3, 4, 6, 9], 7))
`, solution: py`def pair_sum(nums, target):
    lo, hi = 0, len(nums) - 1
    while lo < hi:
        s = nums[lo] + nums[hi]
        if s == target:
            return lo, hi
        if s < target:
            lo += 1
        else:
            hi -= 1
    return None

print(pair_sum([1, 3, 4, 6, 9], 7))
`, hint: ["If the sum is too small, which side has the smaller numbers?", "To make the sum bigger you need a bigger left number, so move lo up. Too big: move hi down."],
      tests: py`assert output.strip() == "(0, 3)" and pair_sum([1, 3, 4, 6, 9], 10) == (0, 4) and pair_sum([1, 2, 3], 100) is None`, explain: "Sorted order is what makes each pointer move justified. Swap them and you throw away good answers." },
    { type: "quiz", q: "Why must the list be sorted for the opposite-ends two-pointer trick to work?", options: ["Python needs sorted input for while loops", "Sorted order tells you which pointer to move to make the sum bigger or smaller", "Sorting makes the list shorter", "It does not need to be sorted"], answer: 1, why: ["Loops don't care about order.", null, "Sorting never changes the length.", "Without order, moving a pointer cannot be justified, so you would miss pairs."], explain: "Order lets you throw away an element with certainty each step." },
    { type: "code", prompt: py`<p>Write <code>pair_sum(nums, target)</code> for a <b>sorted</b> list: return the indices <code>(i, j)</code> with <code>i &lt; j</code> and <code>nums[i] + nums[j] == target</code>, or <code>None</code>. It must run in O(n).</p>`,
      starter: py`def pair_sum(nums, target):
    pass
`, solution: py`def pair_sum(nums, target):
    lo, hi = 0, len(nums) - 1
    while lo < hi:
        s = nums[lo] + nums[hi]
        if s == target:
            return lo, hi
        if s < target:
            lo += 1
        else:
            hi -= 1
    return None`, hint: "lo starts at 0, hi at the end. Compare the sum to the target to decide which pointer moves.",
      tests: py`assert pair_sum([1, 3, 4, 6, 9, 11], 10) == (0, 4)
assert pair_sum([1, 2, 3], 100) is None
assert pair_sum([5], 10) is None
big = list(range(200000))
_, t = timed(pair_sum, big, -1)
assert t < 0.5, "a nested loop would be far too slow here"` },
    { type: "code", prompt: py`<p>Write <code>is_palindrome(s)</code>: ignoring case and anything that is not a letter or digit, does the text read the same both ways? Use two pointers, skipping ignored characters.</p>`,
      starter: py`def is_palindrome(s):
    pass
`, solution: py`def is_palindrome(s):
    i, j = 0, len(s) - 1
    while i < j:
        if not s[i].isalnum():
            i += 1
        elif not s[j].isalnum():
            j -= 1
        elif s[i].lower() != s[j].lower():
            return False
        else:
            i += 1
            j -= 1
    return True`, hint: "Move i forward past non-alphanumerics, j backward likewise, then compare.",
      tests: py`assert is_palindrome("A man, a plan, a canal: Panama")
assert not is_palindrome("hello")
assert is_palindrome("") and is_palindrome("a.")` },
    { type: "code", boss: true, prompt: py`<p>Write <code>remove_duplicates(nums)</code> for a <b>sorted</b> list: return a new list without repeated values, using a read pointer and a write position (no <code>set</code>).</p>`,
      starter: py`def remove_duplicates(nums):
    pass
`, solution: py`def remove_duplicates(nums):
    out = []
    for n in nums:
        if not out or out[-1] != n:
            out.append(n)
    return out`, hint: "In sorted data duplicates are neighbours: keep n only if it differs from the last kept value.",
      tests: py`assert remove_duplicates([1, 1, 2, 3, 3, 3, 4]) == [1, 2, 3, 4]
assert remove_duplicates([]) == [] and remove_duplicates([7]) == [7]` },
  ]},
  { id: "window", rev: 2, needs: ["twopointers"], level: 3, title: "Sliding Window", blurb: "Reuse work as a window slides over data", steps: [
    { type: "predict", probe: true, ask: "Before we start: what do you think this prints?", code: py`nums = [2, 1, 5, 1, 3, 2]
window = sum(nums[:3])
window += nums[3] - nums[0]
print(window)`, answer: "7", explain: "The first window 2+1+5 is 8. Sliding it one step right adds the new number 1 and drops the old number 2: 8 + 1 - 2 = 7. No need to add all three again." },
    { type: "learn", title: "Don't start from scratch", html: py`
      <p>"Best sum of 3 consecutive numbers" invites summing every group of 3 again and again. A <b>sliding window</b> keeps the running total: add the new element, subtract the one that fell off.</p>
      <pre data-try><code>nums = [2, 1, 5, 1, 3, 2]
k = 3
window = sum(nums[:k])
best = window
for i in range(k, len(nums)):
    window += nums[i] - nums[i - k]
    best = max(best, window)
print(best)</code></pre>
      <p>That is O(n) instead of O(n·k). Windows can also grow and shrink to fit a rule, like "no repeated letters".</p>` },
    { type: "learn", title: "A window that grows and shrinks", html: py`
      <pre data-try><code>def longest_unique(s):
    seen = set()
    left = best = 0
    for right, ch in enumerate(s):
        while ch in seen:
            seen.remove(s[left])
            left += 1
        seen.add(ch)
        best = max(best, right - left + 1)
    return best

print(longest_unique("abcabcbb"))</code></pre>
      <p>The right edge always moves forward. The left edge moves forward only when the rule breaks, so together they cross the string once.</p>` },
    { type: "fill", prompt: py`<p>Finish the sliding window: add the number entering the window, subtract the one leaving it, and keep the best total.</p>`,
      template: py`def best_window(nums, k):
    window = sum(nums[:k])
    best = window
    for i in range(k, len(nums)):
        window += nums[i] - nums[___]
        best = ___(best, window)
    return best
`, blanks: ["i - k", "max"], hint: ["The number that just left the window is k places before i.", "Keep the larger of the best so far and the current window."],
      tests: py`assert best_window([2, 1, 5, 1, 3, 2], 3) == 9 and best_window([-5, -1, -3], 1) == -1`, explain: "Each slide does just two operations instead of re-adding k numbers." },
    { type: "order", prompt: py`<p>Write <code>moving_sum(nums, k)</code> returning the sum of every window of <code>k</code> numbers. One line is a trap.</p>`,
      lines: ["def moving_sum(nums, k):", "    total = sum(nums[:k])", "    result = [total]", "    for i in range(k, len(nums)):", "        total += nums[i] - nums[i - k]", "        result.append(total)", "    return result"], distractors: ["        result.append(nums[i])"],
      hint: ["Start with the first window's total, and put it in the result.", "Inside the loop slide the window, then record the new total."],
      tests: py`assert moving_sum([2, 1, 5, 1, 3, 2], 3) == [8, 7, 9, 6] and moving_sum([1, 2], 2) == [3]`, explain: "Recording the total after each slide gives you every window in a single pass." },
    { type: "code", mode: "fix", prompt: py`<p><code>longest_unique("abcabcbb")</code> should be <code>3</code> but prints <code>2</code>. One small counting mistake. Fix it.</p>`,
      starter: py`def longest_unique(s):
    seen = set()
    left = best = 0
    for right, ch in enumerate(s):
        while ch in seen:
            seen.remove(s[left])
            left += 1
        seen.add(ch)
        best = max(best, right - left)
    return best

print(longest_unique("abcabcbb"))
`, solution: py`def longest_unique(s):
    seen = set()
    left = best = 0
    for right, ch in enumerate(s):
        while ch in seen:
            seen.remove(s[left])
            left += 1
        seen.add(ch)
        best = max(best, right - left + 1)
    return best

print(longest_unique("abcabcbb"))
`, hint: ["A window from position 2 to position 4 holds three items. How is that length calculated?", "Both ends are included, so the length is right - left + 1."],
      tests: py`assert output.strip() == "3" and longest_unique("bbbb") == 1 and longest_unique("") == 0 and longest_unique("pwwkew") == 3`, explain: "Counting items between two positions, both included, always needs the + 1." },
    { type: "code", prompt: py`<p>Write <code>best_window(nums, k)</code> returning the largest sum of <code>k</code> consecutive numbers, or <code>None</code> if there are fewer than <code>k</code> numbers. Slide, do not re-sum.</p>`,
      starter: py`def best_window(nums, k):
    pass
`, solution: py`def best_window(nums, k):
    if k > len(nums) or k < 1:
        return None
    window = sum(nums[:k])
    best = window
    for i in range(k, len(nums)):
        window += nums[i] - nums[i - k]
        best = max(best, window)
    return best`, hint: "Start with the first window, then add nums[i] and subtract nums[i - k] each step.",
      tests: py`assert best_window([2, 1, 5, 1, 3, 2], 3) == 9
assert best_window([1, 2], 3) is None
assert best_window([-5, -1, -3], 1) == -1
data = list(range(100000))
_, t = timed(best_window, data, 5000)
assert t < 0.5, "re-summing every window would be too slow"` },
    { type: "code", boss: true, prompt: py`<p>Write <code>shortest_at_least(nums, target)</code> for positive numbers: the length of the shortest run of consecutive numbers whose sum is at least <code>target</code>, or <code>0</code> if none. Grow on the right, shrink on the left.</p>`,
      starter: py`def shortest_at_least(nums, target):
    pass
`, solution: py`def shortest_at_least(nums, target):
    left = total = 0
    best = len(nums) + 1
    for right, n in enumerate(nums):
        total += n
        while total >= target:
            best = min(best, right - left + 1)
            total -= nums[left]
            left += 1
    return best if best <= len(nums) else 0`, hint: "After adding nums[right], keep shrinking from the left while the sum still meets the target, recording the length.",
      tests: py`assert shortest_at_least([2, 3, 1, 2, 4, 3], 7) == 2
assert shortest_at_least([1, 1, 1], 10) == 0
assert shortest_at_least([5], 5) == 1` },
  ]},
  { id: "dp", rev: 2, needs: ["memo", "window"], level: 4, title: "Dynamic Programming", blurb: "Solve big problems from remembered small ones", steps: [
    { type: "predict", probe: true, ask: "Before we start: what do you think this prints?", code: py`ways = [1, 1]
for i in range(2, 6):
    ways.append(ways[i - 1] + ways[i - 2])
print(ways)`, answer: "[1, 1, 2, 3, 5, 8]", explain: "Each entry is built from the two before it: 1+1=2, 1+2=3, 2+3=5, 3+5=8. A table of sub-answers grows into the final answer." },
    { type: "learn", title: "Remember sub-answers", html: py`
      <p>You met memoization: save results so you never recompute. <b>Dynamic programming</b> (DP) is the same idea, built from the bottom up in a table. How many ways can you climb n stairs taking 1 or 2 steps at a time? The last step was 1 or 2, so <code>ways[n] = ways[n-1] + ways[n-2]</code>:</p>
      <pre data-try><code>def stairs(n):
    ways = [1, 1] + [0] * (n - 1)
    for i in range(2, n + 1):
        ways[i] = ways[i - 1] + ways[i - 2]
    return ways[n]

print([stairs(n) for n in range(1, 8)])</code></pre>
      <p>Recipe: (1) define what <code>table[i]</code> means, (2) find how it depends on smaller entries, (3) set the starting values, (4) fill in order.</p>` },
    { type: "fill", prompt: py`<p>You can't rob two neighbouring houses. At each house either skip it, or rob it and add the money to what you had two houses ago. Keep the better.</p>`,
      template: py`def rob(houses):
    prev2, prev1 = 0, 0
    for money in houses:
        prev2, prev1 = prev1, ___(prev1, prev2 + ___)
    return prev1
`, blanks: ["max", "money"], hint: ["You want the larger of two options.", "Robbing this house adds its money to prev2."],
      tests: py`assert rob([1, 2, 3, 1]) == 4 and rob([2, 7, 9, 3, 1]) == 12 and rob([]) == 0 and rob([5]) == 5`, explain: "At every step the best answer so far depends only on the two previous best answers." },
    { type: "order", prompt: py`<p>Build the table of ways to climb <code>n</code> stairs with 1 or 2 steps. One line is a trap.</p>`,
      lines: ["def stairs(n):", "    ways = [1, 1] + [0] * (n - 1)", "    for i in range(2, n + 1):", "        ways[i] = ways[i - 1] + ways[i - 2]", "    return ways[n]"], distractors: ["        ways[i] = ways[i - 1] * ways[i - 2]"],
      hint: ["Create the table, then fill it in order.", "Each entry is the sum of the two before it."],
      tests: py`assert stairs(1) == 1 and stairs(2) == 2 and stairs(5) == 8 and stairs(30) == 1346269`, explain: "Filling the table from small to large means each sub-answer is ready when you need it." },
    { type: "code", mode: "fix", prompt: py`<p>This should print <code>6</code> paths through a 3 by 3 grid, but prints <code>0</code>. The table starts with the wrong values. Fix it.</p>`,
      starter: py`def count_paths(rows, cols):
    table = [[0] * cols for _ in range(rows)]
    for r in range(1, rows):
        for c in range(1, cols):
            table[r][c] = table[r - 1][c] + table[r][c - 1]
    return table[rows - 1][cols - 1]

print(count_paths(3, 3))
`, solution: py`def count_paths(rows, cols):
    table = [[1] * cols for _ in range(rows)]
    for r in range(1, rows):
        for c in range(1, cols):
            table[r][c] = table[r - 1][c] + table[r][c - 1]
    return table[rows - 1][cols - 1]

print(count_paths(3, 3))
`, hint: ["Add up zeros and you only ever get zeros. What should the first row and column be?", "There is exactly one way to reach any cell in the first row or column, so start with 1s."],
      tests: py`assert output.strip() == "6" and count_paths(1, 5) == 1 and count_paths(3, 7) == 28`, explain: "Base cases seed the table. If they are wrong, every answer built from them is wrong too." },
    { type: "quiz", q: "Which signals tell you a problem is a good fit for DP?", options: ["It uses a list", "The same sub-problems repeat and the best answer is built from best sub-answers", "It has a loop", "The input is a string"], answer: 1, why: ["Almost everything uses a list.", null, "Almost everything has a loop.", "DP works on numbers, strings, grids and more."], explain: "Overlapping sub-problems plus optimal substructure." },
    { type: "code", prompt: py`<p>Write <code>rob(houses)</code>: each number is the money in a house on a street, and you cannot rob two neighbours. Return the most you can take. Let <code>best[i]</code> be the best using the first <code>i</code> houses.</p>`,
      starter: py`def rob(houses):
    pass
`, solution: py`def rob(houses):
    prev2, prev1 = 0, 0
    for money in houses:
        prev2, prev1 = prev1, max(prev1, prev2 + money)
    return prev1`, hint: "At each house: skip it (keep prev1) or rob it (prev2 + money). Keep the better.",
      tests: py`assert rob([1, 2, 3, 1]) == 4
assert rob([2, 7, 9, 3, 1]) == 12
assert rob([]) == 0 and rob([5]) == 5
assert rob([3] * 10000) == 15000` },
    { type: "code", boss: true, prompt: py`<p>Write <code>lcs_length(a, b)</code>: the length of the longest common subsequence of two strings (letters in order, not necessarily next to each other). <code>lcs_length("abcde", "ace")</code> is 3.</p>`,
      starter: py`def lcs_length(a, b):
    pass
`, solution: py`def lcs_length(a, b):
    table = [[0] * (len(b) + 1) for _ in range(len(a) + 1)]
    for i in range(1, len(a) + 1):
        for j in range(1, len(b) + 1):
            if a[i - 1] == b[j - 1]:
                table[i][j] = table[i - 1][j - 1] + 1
            else:
                table[i][j] = max(table[i - 1][j], table[i][j - 1])
    return table[len(a)][len(b)]`, hint: "table[i][j] is the answer for a[:i] and b[:j]. Equal last letters extend the diagonal; otherwise take the better of dropping one letter.",
      tests: py`assert lcs_length("abcde", "ace") == 3 and lcs_length("abc", "xyz") == 0
assert lcs_length("", "abc") == 0 and lcs_length("AGGTAB", "GXTXAYB") == 4` },
  ]},
  { id: "backtrack", rev: 2, needs: ["recursion", "twopointers"], level: 4, title: "Backtracking", blurb: "Try a choice, explore, undo it, try the next", steps: [
    { type: "predict", probe: true, ask: "Before we start: what do you think this prints?", code: py`out = []

def go(i, chosen):
    if i == 2:
        out.append(chosen[:])
        return
    go(i + 1, chosen)
    chosen.append(i)
    go(i + 1, chosen)
    chosen.pop()

go(0, [])
print(out)`, answer: "[[], [1], [0], [0, 1]]", explain: "At each position the code first explores leaving the number out, then explores putting it in. After exploring it takes the number back out (pop) so the next branch starts clean. That makes 4 subsets." },
    { type: "learn", title: "Explore every possibility", html: py`
      <p>Some problems ask for <i>all</i> arrangements: every subset, every valid password, every way to place queens. <b>Backtracking</b> builds an answer one choice at a time with recursion. When a choice leads nowhere, it undoes it and tries the next.</p>
      <pre data-try><code>def subsets(items):
    out = []
    def go(i, chosen):
        if i == len(items):
            out.append(chosen[:])
            return
        go(i + 1, chosen)            # leave this item out
        chosen.append(items[i])      # choose it
        go(i + 1, chosen)
        chosen.pop()                 # undo, so the caller sees it unchanged
    go(0, [])
    return out

print(subsets([1, 2, 3]))</code></pre>
      <p>The pattern is always: <b>choose, explore, un-choose</b>. Copy the list (<code>chosen[:]</code>) when you record a result, because it keeps changing.</p>` },
    { type: "fill", prompt: py`<p>Finish <code>subsets</code>: for each position first leave the item out, then put it in and explore again.</p>`,
      template: py`def subsets(items):
    out = []

    def go(i, chosen):
        if i == len(items):
            out.append(chosen[:])
            return
        go(i + 1, chosen)
        chosen.append(items[___])
        go(i + ___, chosen)
        chosen.pop()

    go(0, [])
    return out
`, blanks: ["i", "1"], hint: ["The item you are deciding about sits at position i.", "Both branches move on to the next position."],
      tests: py`assert sorted(subsets([1, 2, 3])) == [[], [1], [1, 2], [1, 2, 3], [1, 3], [2], [2, 3], [3]] and subsets([]) == [[]]`, explain: "Every position is a yes/no decision, so n items make 2 to the power n subsets." },
    { type: "order", prompt: py`<p>List every binary string of length <code>n</code>. One line is a trap.</p>`,
      lines: ["def binary_strings(n):", "    out = []", "    def go(prefix):", "        if len(prefix) == n:", "            out.append(prefix)", "            return", "        go(prefix + \"0\")", "        go(prefix + \"1\")", "    go(\"\")", "    return out"], distractors: ["        go(prefix + \"2\")"],
      hint: ["Set up the list and the helper first, then start the search.", "The helper stops when the prefix is long enough, otherwise it tries 0 and then 1."],
      tests: py`assert binary_strings(2) == ["00", "01", "10", "11"] and binary_strings(0) == [""] and len(binary_strings(5)) == 32`, explain: "Backtracking grows an answer one choice at a time and records it when it is complete." },
    { type: "predict", code: py`out = []
def go(path, n):
    if len(path) == n:
        out.append("".join(path))
        return
    for ch in "ab":
        path.append(ch)
        go(path, n)
        path.pop()

go([], 2)
print(out)`, answer: py`['aa', 'ab', 'ba', 'bb']` },
    { type: "code", mode: "fix", prompt: py`<p><code>subsets([1, 2])</code> should list <code>[], [1], [1, 2], [2]</code> in some order, but the results are wrong. One line of the pattern is missing. Fix it.</p>`,
      starter: py`def subsets(items):
    out = []

    def go(i, chosen):
        if i == len(items):
            out.append(chosen[:])
            return
        go(i + 1, chosen)
        chosen.append(items[i])
        go(i + 1, chosen)

    go(0, [])
    return out

print(sorted(subsets([1, 2])))
`, solution: py`def subsets(items):
    out = []

    def go(i, chosen):
        if i == len(items):
            out.append(chosen[:])
            return
        go(i + 1, chosen)
        chosen.append(items[i])
        go(i + 1, chosen)
        chosen.pop()

    go(0, [])
    return out

print(sorted(subsets([1, 2])))
`, hint: ["Look at which numbers appear where they shouldn't.", "After exploring a choice you must undo it, or the next branch inherits it. Add the missing pop()."],
      tests: py`assert output.strip() == "[[], [1], [1, 2], [2]]" and sorted(subsets([1, 2, 3]))[0] == []`, explain: "choose, explore, un-choose: forgetting the last step leaks choices into other branches." },
    { type: "code", prompt: py`<p>Write <code>permutations_of(items)</code> returning all orderings of a list as a list of lists (any order is fine; the tests sort them). Do not use itertools.</p>`,
      starter: py`def permutations_of(items):
    pass
`, solution: py`def permutations_of(items):
    out = []

    def go(chosen, left):
        if not left:
            out.append(chosen[:])
            return
        for i in range(len(left)):
            chosen.append(left[i])
            go(chosen, left[:i] + left[i + 1:])
            chosen.pop()

    go([], list(items))
    return out`, hint: "Choose each remaining item in turn, recurse on the rest, then pop it again.",
      tests: py`r = permutations_of([1, 2, 3])
assert sorted(r) == [[1, 2, 3], [1, 3, 2], [2, 1, 3], [2, 3, 1], [3, 1, 2], [3, 2, 1]]
assert permutations_of([]) == [[]] and len(permutations_of(list(range(6)))) == 720` },
    { type: "code", boss: true, prompt: py`<p>Write <code>combination_sums(nums, target)</code>: all lists of numbers from <code>nums</code> (each number may be reused any number of times, numbers are positive and distinct) that add up to <code>target</code>. Keep each list in the same order as <code>nums</code>, so [2,2,3] but never [3,2,2]. Prune: stop exploring when the total passes the target.</p>`,
      starter: py`def combination_sums(nums, target):
    pass
`, solution: py`def combination_sums(nums, target):
    out = []

    def go(start, chosen, total):
        if total == target:
            out.append(chosen[:])
            return
        for i in range(start, len(nums)):
            if total + nums[i] > target:
                continue
            chosen.append(nums[i])
            go(i, chosen, total + nums[i])
            chosen.pop()

    go(0, [], 0)
    return out`, hint: "Recurse with start=i (reuse allowed) so you never go backwards, which prevents duplicates like [3,2,2].",
      tests: py`assert sorted(combination_sums([2, 3, 6, 7], 7)) == [[2, 2, 3], [7]]
assert combination_sums([5], 3) == [] and combination_sums([1], 3) == [[1, 1, 1]]` },
  ]},
  { id: "coins", kind: "project", needs: ["dp"], level: 4, title: "Mini: Coin Change", blurb: "How a cash register finds the fewest coins", steps: [
    { type: "learn", title: "Greedy fails, DP wins", html: py`
      <p>A cashier owes you change. The obvious plan, <b>greedy</b>: always hand over the biggest coin that fits. With coins 1, 5, 10 that works. But with coins <code>[1, 3, 4]</code> and an amount of 6, greedy gives 4+1+1 (three coins) while the best is 3+3 (two coins).</p>
      <pre data-try><code>def greedy(coins, amount):
    count = 0
    for c in sorted(coins, reverse=True):
        count += amount // c
        amount %= c
    return count if amount == 0 else -1

print(greedy([1, 3, 4], 6))</code></pre>
      <p>You will build the correct DP solution in three pieces.</p>` },
    { type: "code", prompt: py`<p><b>Piece 1.</b> Write <code>min_coins(coins, amount)</code> returning the fewest coins that add up to <code>amount</code>, or <code>-1</code> if impossible. <code>best[a]</code> = fewest coins for amount <code>a</code>, built from <code>best[a - coin] + 1</code>.</p>`,
      starter: py`def min_coins(coins, amount):
    pass
`, solution: py`def min_coins(coins, amount):
    inf = float("inf")
    best = [0] + [inf] * amount
    for a in range(1, amount + 1):
        for c in coins:
            if c <= a and best[a - c] + 1 < best[a]:
                best[a] = best[a - c] + 1
    return best[amount] if best[amount] != inf else -1`, hint: "best[0] = 0, others start at infinity. For each amount try every coin.",
      tests: py`assert min_coins([1, 3, 4], 6) == 2
assert min_coins([2], 3) == -1
assert min_coins([1, 5, 10, 25], 63) == 6
assert min_coins([5], 0) == 0
assert min_coins([186, 419, 83, 408], 6249) == 20` },
    { type: "code", prompt: py`<p><b>Piece 2.</b> Write <code>ways_to_make(coins, amount)</code>: the number of different <i>combinations</i> (order does not matter) of coins that make the amount. <code>ways_to_make([1, 2, 5], 5)</code> is 4. Loop over coins in the outer loop so each combination is counted once.</p>`,
      starter: py`def ways_to_make(coins, amount):
    pass
`, solution: py`def ways_to_make(coins, amount):
    ways = [1] + [0] * amount
    for c in coins:
        for a in range(c, amount + 1):
            ways[a] += ways[a - c]
    return ways[amount]`, hint: "ways[0] = 1 (the empty combination). For each coin, ways[a] += ways[a - coin].",
      tests: py`assert ways_to_make([1, 2, 5], 5) == 4 and ways_to_make([2], 3) == 0
assert ways_to_make([10], 10) == 1 and ways_to_make([1, 2, 5], 0) == 1` },
    { type: "code", prompt: py`<p><b>Piece 3: show the coins.</b> Write <code>change(coins, amount)</code> returning a sorted (largest first) list of the coins in one fewest-coin solution, or <code>None</code> if impossible. Remember which coin you used for each amount, then walk back.</p>`,
      starter: py`def change(coins, amount):
    pass
`, solution: py`def change(coins, amount):
    inf = float("inf")
    best = [0] + [inf] * amount
    used = [0] * (amount + 1)
    for a in range(1, amount + 1):
        for c in coins:
            if c <= a and best[a - c] + 1 < best[a]:
                best[a] = best[a - c] + 1
                used[a] = c
    if best[amount] == inf:
        return None
    result = []
    while amount:
        result.append(used[amount])
        amount -= used[amount]
    return sorted(result, reverse=True)`, hint: "Store used[a] = the coin that gave the best count, then repeatedly subtract used[amount].",
      tests: py`assert change([1, 3, 4], 6) == [3, 3]
assert change([1, 5, 10, 25], 63) == [25, 25, 10, 1, 1, 1]
assert change([2], 3) is None and change([5], 0) == []` },
  ]},
  { id: "subsets", kind: "project", needs: ["backtrack"], level: 4, title: "Mini: Password Cracker", blurb: "Try every combination, then prune the search", steps: [
    { type: "learn", title: "Brute force, then smarter", html: py`
      <p>A 3-digit PIN has only 1000 possibilities, so trying them all is easy for a computer. That is why short passwords are weak. In this project you generate guesses with backtracking and learn how <b>pruning</b> cuts the work.</p>
      <pre data-try><code>from itertools import product
guesses = ["".join(p) for p in product("01", repeat=3)]
print(guesses)</code></pre>` },
    { type: "code", prompt: py`<p><b>Piece 1.</b> Write <code>all_codes(alphabet, length)</code> returning every string of that length using only characters from <code>alphabet</code>, in alphabetical order, with backtracking (no itertools).</p>`,
      starter: py`def all_codes(alphabet, length):
    pass
`, solution: py`def all_codes(alphabet, length):
    out = []

    def go(chosen):
        if len(chosen) == length:
            out.append("".join(chosen))
            return
        for ch in sorted(alphabet):
            chosen.append(ch)
            go(chosen)
            chosen.pop()

    go([])
    return out`, hint: "Choose a character, recurse, pop it. When the code is long enough, record it.",
      tests: py`assert all_codes("ab", 2) == ["aa", "ab", "ba", "bb"]
assert len(all_codes("0123456789", 3)) == 1000 and all_codes("x", 0) == [""]` },
    { type: "code", prompt: py`<p><b>Piece 2.</b> Write <code>crack(check, alphabet, max_len)</code>: try codes of length 1, then 2, ... up to <code>max_len</code> (shorter first) and return the first one for which <code>check(code)</code> is True, or <code>None</code>. Reuse an <code>all_codes</code> helper (provided).</p>`,
      starter: py`def all_codes(alphabet, length):
    out = []

    def go(chosen):
        if len(chosen) == length:
            out.append("".join(chosen))
            return
        for ch in sorted(alphabet):
            chosen.append(ch)
            go(chosen)
            chosen.pop()

    go([])
    return out

def crack(check, alphabet, max_len):
    pass
`, solution: py`def all_codes(alphabet, length):
    out = []

    def go(chosen):
        if len(chosen) == length:
            out.append("".join(chosen))
            return
        for ch in sorted(alphabet):
            chosen.append(ch)
            go(chosen)
            chosen.pop()

    go([])
    return out

def crack(check, alphabet, max_len):
    for length in range(1, max_len + 1):
        for code in all_codes(alphabet, length):
            if check(code):
                return code
    return None`, hint: "Two loops: over lengths, then over the codes of that length.",
      tests: py`assert crack(lambda c: c == "42", "0123456789", 3) == "42"
assert crack(lambda c: c == "zzzz", "abc", 3) is None
assert crack(lambda c: True, "ab", 2) == "a"` },
    { type: "code", prompt: py`<p><b>Piece 3: prune.</b> Write <code>count_valid(alphabet, length)</code> returning how many strings of that length never have the same character twice in a row. Prune: do not extend a code with the character it just ended with. (That is the whole point: you never build the invalid ones.)</p>`,
      starter: py`def count_valid(alphabet, length):
    pass
`, solution: py`def count_valid(alphabet, length):
    alphabet = sorted(set(alphabet))
    count = 0

    def go(last, size):
        nonlocal count
        if size == length:
            count += 1
            return
        for ch in alphabet:
            if ch != last:
                go(ch, size + 1)

    go(None, 0)
    return count`, hint: "Pass the last character to the recursive call and skip it in the loop.",
      tests: py`assert count_valid("ab", 3) == 2 and count_valid("abc", 3) == 12
assert count_valid("abc", 0) == 1 and count_valid("a", 2) == 0
assert count_valid("abcd", 8) == 4 * 3 ** 7` },
  ]},
  ]
},
{
  id: "project", title: "Build a Program", desc: "Put your skills together in one small project", color: "blue",
  lessons: [
  { id: "gradebook", rev: 2, needs: ["comprehensions", "sorting", "twosum", "bank", "loganalyzer", "timer", "coins", "subsets"], level: 4, title: "Capstone: Gradebook", blurb: "Combine everything you have learned into one real program", steps: [
    { type: "learn", title: "Plan the program", html: py`
      <p>Real programs are small pieces that fit together. Today you build a <b>gradebook</b>: record scores for students, work out averages and print a ranking.</p>
      <p>The data is a <b>dict</b> mapping each name to a <b>list</b> of scores. Each piece is a <b>function</b>, and the last one reuses the others:</p>
      <pre data-try><code>book = {}
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
    { type: "code", boss: true, prompt: py`<p><b>Piece 4: put it together.</b> Write <code>report(book)</code> returning one string with a line per student, like <code>"1. Ada 95.0"</code>, best first, lines joined by <code>"\n"</code>. An empty gradebook gives <code>"No scores yet"</code>. <code>ranking</code> is already written.</p>`,
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
