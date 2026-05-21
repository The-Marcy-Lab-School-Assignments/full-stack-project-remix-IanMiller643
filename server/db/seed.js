const bcrypt = require('bcrypt');
const pool = require('./pool');

const SALT_ROUNDS = 8;

const seed = async () => {
  await pool.query('DROP TABLE IF EXISTS cards');
  await pool.query('DROP TABLE IF EXISTS decks');
  await pool.query('DROP TABLE IF EXISTS users');

  await pool.query(`
    CREATE TABLE users (
      user_id       SERIAL PRIMARY KEY,
      username      TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL
    )
  `);

  await pool.query(`
    CREATE TABLE decks (
      deck_id     SERIAL PRIMARY KEY,
      title       TEXT NOT NULL,
      description TEXT,
      is_public   BOOLEAN DEFAULT FALSE,
      user_id     INTEGER REFERENCES users(user_id) ON DELETE CASCADE
    )
  `);

  await pool.query(`
    CREATE TABLE cards (
      card_id     SERIAL PRIMARY KEY,
      front       TEXT NOT NULL,
      back        TEXT NOT NULL,
      deck_id     INTEGER REFERENCES decks(deck_id) ON DELETE CASCADE
    )
  `);

  const [aliceHash, bobHash] = await Promise.all([
    bcrypt.hash('password123', SALT_ROUNDS),
    bcrypt.hash('password123', SALT_ROUNDS),
  ]);

  const { rows: users } = await pool.query(`
    INSERT INTO users (username, password_hash) VALUES
      ('alice', $1),
      ('bob',   $2)
    RETURNING user_id, username
  `, [aliceHash, bobHash]);

  const [alice, bob] = users;

  // --- Deck definitions ---
  const aliceDecks = [
    { title: 'JavaScript Basics', description: 'Core JS concepts', is_public: true },
    { title: 'React Fundamentals', description: 'Components, hooks, and state', is_public: true },
    { title: 'CSS Mastery', description: 'Layouts, animations, and more', is_public: true },
    { title: 'TypeScript Deep Dive', description: 'Types, generics, and tools', is_public: false },
    { title: 'Node.js Essentials', description: 'Server-side JavaScript', is_public: true },
    { title: 'Testing with Jest', description: 'Unit and integration testing', is_public: false },
    { title: 'Git & GitHub', description: 'Version control workflows', is_public: true },
    { title: 'Web Accessibility', description: 'ARIA, semantics, and WCAG', is_public: true },
    { title: 'Design Patterns', description: 'Classic software patterns', is_public: false },
    { title: 'HTTP & REST APIs', description: 'How the web communicates', is_public: true },
  ];

  const bobDecks = [
    { title: 'PostgreSQL', description: 'Database commands and tuning', is_public: true },
    { title: 'Python Basics', description: 'Core Python syntax', is_public: true },
    { title: 'Docker & Containers', description: 'Containerization essentials', is_public: true },
    { title: 'Linux Command Line', description: 'Shell commands and scripting', is_public: false },
    { title: 'Data Structures', description: 'Arrays, trees, graphs & more', is_public: true },
    { title: 'Algorithms', description: 'Sorting, searching, recursion', is_public: true },
    { title: 'AWS Cloud Basics', description: 'Core AWS services', is_public: false },
    { title: 'GraphQL', description: 'Queries, mutations, schemas', is_public: true },
    { title: 'System Design', description: 'Scalability and architecture', is_public: false },
    { title: 'Regex Patterns', description: 'Regular expression recipes', is_public: true },
  ];

  // --- Card definitions (20 per deck, matched by index) ---
  const aliceCards = [
    // 0: JavaScript Basics
    [
      ['What is a closure?', 'A function that retains access to its lexical scope.'],
      ['What is hoisting?', 'Variable/function declarations are moved to the top of their scope.'],
      ['== vs ===', '=== checks value and type; == coerces types first.'],
      ['What is the event loop?', 'A mechanism that processes the callback queue after the call stack is empty.'],
      ['null vs undefined', 'null is intentional absence; undefined means a variable has no value yet.'],
      ['What is a Promise?', 'An object representing an eventual completion or failure of async work.'],
      ['Arrow functions vs regular', 'Arrow functions do not bind their own `this`.'],
      ['What is destructuring?', 'Extracting values from arrays or objects into variables.'],
      ['Spread operator usage', 'Expands an iterable into individual elements.'],
      ['What is a prototype?', 'An object from which other objects inherit properties.'],
      ['typeof null', '"object" — a historical bug in JavaScript.'],
      ['Array.map() purpose', 'Returns a new array with each element transformed by a callback.'],
      ['Array.reduce() purpose', 'Reduces an array to a single value using an accumulator.'],
      ['What is a generator?', 'A function that can pause and resume using yield.'],
      ['What is a Symbol?', 'A unique and immutable primitive value used as object keys.'],
      ['WeakMap vs Map', 'WeakMap holds weak references and only allows object keys.'],
      ['What is currying?', 'Transforming a function with multiple args into a chain of single-arg functions.'],
      ['What does JSON.parse do?', 'Converts a JSON string into a JavaScript object.'],
      ['Event bubbling vs capturing', 'Bubbling goes child→parent; capturing goes parent→child.'],
      ['What is a polyfill?', 'Code that implements a feature in browsers that do not support it natively.'],
    ],
    // 1: React Fundamentals
    [
      ['What is a component?', 'A reusable piece of UI, either a function or class.'],
      ['useState purpose', 'Adds local state to a functional component.'],
      ['useEffect purpose', 'Runs side effects after render (fetch, subscriptions, DOM updates).'],
      ['What is JSX?', 'A syntax extension that lets you write HTML-like code in JavaScript.'],
      ['Props vs State', 'Props are passed in; state is managed internally.'],
      ['What is the virtual DOM?', 'A lightweight in-memory representation of the real DOM.'],
      ['useCallback purpose', 'Memoizes a function so it is not recreated on every render.'],
      ['useMemo purpose', 'Memoizes an expensive computed value.'],
      ['useRef purpose', 'Holds a mutable value that persists across renders without triggering re-renders.'],
      ['What is lifting state up?', 'Moving shared state to the nearest common ancestor component.'],
      ['What is React Context?', 'A way to pass data through the component tree without props drilling.'],
      ['Controlled vs uncontrolled input', 'Controlled inputs bind value to state; uncontrolled use refs.'],
      ['What is reconciliation?', 'React\'s process of diffing the virtual DOM to update the real DOM efficiently.'],
      ['Key prop purpose', 'Helps React identify which list items have changed.'],
      ['useReducer vs useState', 'useReducer is better for complex state logic with multiple sub-values.'],
      ['What is Suspense?', 'A component that shows a fallback while its children are loading.'],
      ['What is React.memo?', 'Prevents a component from re-rendering if its props have not changed.'],
      ['What is a custom hook?', 'A function starting with "use" that encapsulates reusable stateful logic.'],
      ['StrictMode purpose', 'Highlights potential problems in an app during development.'],
      ['What is hydration?', 'Attaching React event listeners to server-rendered HTML.'],
    ],
    // 2: CSS Mastery
    [
      ['Box model components', 'Content, padding, border, and margin.'],
      ['Flexbox main axis', 'Defined by flex-direction; default is row (horizontal).'],
      ['Grid vs Flexbox', 'Grid is two-dimensional; Flexbox is one-dimensional.'],
      ['What is specificity?', 'A weight system determining which CSS rule applies.'],
      ['position: absolute', 'Positioned relative to the nearest positioned ancestor.'],
      ['position: sticky', 'Acts like relative until a scroll threshold, then like fixed.'],
      ['CSS custom properties', 'Variables declared with -- and used with var().'],
      ['What is z-index?', 'Controls the stacking order of positioned elements.'],
      ['min-width vs max-width', 'min-width sets a floor; max-width sets a ceiling for element width.'],
      ['What is a pseudo-element?', '::before and ::after insert content without extra HTML.'],
      ['What is a pseudo-class?', ':hover, :focus, :nth-child — style based on state or position.'],
      ['transition vs animation', 'Transition is triggered by state change; animation runs independently.'],
      ['rem vs em', 'rem is relative to root font size; em is relative to parent.'],
      ['What is BEM?', 'A naming convention: Block__Element--Modifier.'],
      ['object-fit: cover', 'Scales image to fill container while preserving aspect ratio.'],
      ['What is a media query?', 'Applies styles based on device characteristics like width.'],
      ['display: none vs visibility: hidden', 'none removes from layout; hidden hides but keeps space.'],
      ['CSS cascade order', 'Importance, then specificity, then source order.'],
      ['What is clamp()?', 'Sets a value between a min and max that scales fluidly.'],
      ['will-change property', 'Hints to the browser which properties will animate for optimization.'],
    ],
    // 3: TypeScript Deep Dive
    [
      ['What is TypeScript?', 'A typed superset of JavaScript that compiles to plain JS.'],
      ['interface vs type alias', 'Interfaces are extendable; type aliases can represent any type.'],
      ['What is a generic?', 'A placeholder type that makes functions and classes reusable.'],
      ['Partial<T> utility', 'Makes all properties of T optional.'],
      ['Required<T> utility', 'Makes all properties of T required.'],
      ['Readonly<T> utility', 'Makes all properties of T non-writable.'],
      ['Pick<T, K> utility', 'Creates a type with only the specified keys of T.'],
      ['Omit<T, K> utility', 'Creates a type excluding the specified keys of T.'],
      ['What is a union type?', 'A type that can be one of several types: A | B.'],
      ['What is an intersection type?', 'Combines multiple types into one: A & B.'],
      ['What is a discriminated union?', 'A union with a shared literal field used to narrow types.'],
      ['keyof operator', 'Produces a union of keys of a given type.'],
      ['typeof in TS', 'Captures the type of a variable or expression.'],
      ['What are decorators?', 'Functions that modify classes or members at design time.'],
      ['What is never?', 'A type for values that never occur, like exhausted unions.'],
      ['unknown vs any', 'unknown is type-safe; any opts out of type checking entirely.'],
      ['as const assertion', 'Makes an object deeply readonly with literal types.'],
      ['What is a tuple?', 'A fixed-length array with known types at each index.'],
      ['Mapped types purpose', 'Create new types by transforming each property of an existing type.'],
      ['Template literal types', 'Build string types using template literal syntax.'],
    ],
    // 4: Node.js Essentials
    [
      ['What is Node.js?', 'A JavaScript runtime built on Chrome\'s V8 engine.'],
      ['What is the event loop in Node?', 'A loop that processes async I/O callbacks outside the call stack.'],
      ['require vs import', 'require is CommonJS; import is ES Modules.'],
      ['What is middleware?', 'A function that processes requests between receipt and response.'],
      ['What is Express.js?', 'A minimal web framework for Node.js.'],
      ['process.env usage', 'Accesses environment variables at runtime.'],
      ['What is a stream?', 'A sequence of data processed piece by piece without buffering all of it.'],
      ['Buffer purpose', 'Handles binary data in Node.js.'],
      ['__dirname vs __filename', '__dirname is the directory path; __filename is the full file path.'],
      ['What is npm?', 'Node Package Manager — installs and manages JS packages.'],
      ['package.json purpose', 'Defines project metadata, scripts, and dependencies.'],
      ['What is nodemon?', 'A tool that restarts Node automatically when files change.'],
      ['Cluster module purpose', 'Forks Node processes to use multiple CPU cores.'],
      ['What is CORS?', 'A security feature controlling which origins can call your API.'],
      ['What is JWT?', 'A compact token for securely transmitting claims between parties.'],
      ['Error-first callbacks', 'Node convention: callback(err, result) — check err first.'],
      ['What is async/await?', 'Syntax sugar over Promises for writing async code synchronously.'],
      ['What is path.join?', 'Safely joins path segments using the OS separator.'],
      ['fs.readFile purpose', 'Reads a file asynchronously and passes content to a callback.'],
      ['What is a REST API?', 'An API using HTTP methods and stateless request/response cycles.'],
    ],
    // 5: Testing with Jest
    [
      ['What is Jest?', 'A JavaScript testing framework by Meta.'],
      ['describe() purpose', 'Groups related tests into a named block.'],
      ['it() vs test()', 'They are aliases — both define a single test case.'],
      ['expect().toBe()', 'Checks strict equality (===) between values.'],
      ['expect().toEqual()', 'Recursively checks deep equality of objects and arrays.'],
      ['What is a mock?', 'A fake function that records calls and can return preset values.'],
      ['jest.fn() purpose', 'Creates a mock function to spy on or replace behavior.'],
      ['beforeEach() purpose', 'Runs setup code before each test in a describe block.'],
      ['afterEach() purpose', 'Runs teardown code after each test in a describe block.'],
      ['What is code coverage?', 'A metric showing what percentage of code is exercised by tests.'],
      ['What is a snapshot test?', 'Serializes component output and compares it to a saved snapshot.'],
      ['toThrow() purpose', 'Asserts that a function throws an error when called.'],
      ['What is spyOn?', 'Tracks calls to an existing method without replacing it.'],
      ['Mocking modules in Jest', 'Use jest.mock(\'module\') to auto-mock an entire module.'],
      ['What is TDD?', 'Writing tests before code to drive implementation.'],
      ['async test pattern', 'Return a Promise or use async/await inside test().'],
      ['What is a test double?', 'A generic term for stubs, mocks, fakes, and spies.'],
      ['toHaveBeenCalledWith()', 'Asserts a mock was called with specific arguments.'],
      ['What is a stub?', 'A test double that returns preset responses to specific calls.'],
      ['Coverage thresholds', 'Configured in Jest to fail if coverage drops below a set percent.'],
    ],
    // 6: Git & GitHub
    [
      ['git init purpose', 'Initialises a new Git repository in the current directory.'],
      ['git clone purpose', 'Copies a remote repository to your local machine.'],
      ['git add . purpose', 'Stages all changed files for the next commit.'],
      ['git commit -m', 'Saves staged changes with a descriptive message.'],
      ['git push purpose', 'Uploads local commits to a remote repository.'],
      ['git pull purpose', 'Fetches and merges changes from a remote branch.'],
      ['git branch purpose', 'Lists, creates, or deletes branches.'],
      ['git checkout -b', 'Creates and switches to a new branch in one step.'],
      ['git merge purpose', 'Integrates changes from one branch into another.'],
      ['git rebase purpose', 'Reapplies commits on top of another base commit.'],
      ['git stash purpose', 'Temporarily shelves uncommitted changes.'],
      ['git log purpose', 'Shows the commit history for the current branch.'],
      ['git diff purpose', 'Shows changes between commits, working tree, or index.'],
      ['git reset --hard', 'Discards all uncommitted changes and resets to a commit.'],
      ['git revert purpose', 'Creates a new commit that undoes a previous commit.'],
      ['What is a pull request?', 'A request to merge changes from one branch into another.'],
      ['What is a .gitignore?', 'A file listing paths Git should not track.'],
      ['git fetch vs pull', 'Fetch downloads changes; pull fetches and merges.'],
      ['What is a merge conflict?', 'Occurs when two branches change the same lines differently.'],
      ['git tag purpose', 'Marks a specific commit, often used for releases.'],
    ],
    // 7: Web Accessibility
    [
      ['What is WCAG?', 'Web Content Accessibility Guidelines — the international standard.'],
      ['What is ARIA?', 'Accessible Rich Internet Applications — attributes for assistive tech.'],
      ['role="button" usage', 'Tells screen readers an element behaves like a button.'],
      ['aria-label purpose', 'Provides an accessible name for an element without visible text.'],
      ['aria-hidden purpose', 'Hides an element from assistive technologies.'],
      ['What is alt text?', 'A text description of an image for screen readers and broken images.'],
      ['Focus management', 'Ensuring keyboard focus moves logically through the page.'],
      ['What is tab order?', 'The sequence in which elements receive keyboard focus.'],
      ['Color contrast ratio', 'Minimum 4.5:1 for normal text per WCAG AA.'],
      ['What is a skip link?', 'A link that lets keyboard users jump past repetitive navigation.'],
      ['Semantic HTML benefit', 'Uses elements like <nav>, <main>, <button> for built-in accessibility.'],
      ['aria-live purpose', 'Announces dynamic content changes to screen readers.'],
      ['What is keyboard trap?', 'When focus becomes stuck inside a component, preventing navigation.'],
      ['fieldset and legend usage', 'Groups related form inputs with a shared label.'],
      ['What is NVDA?', 'A free screen reader for Windows.'],
      ['prefers-reduced-motion', 'CSS media query to disable animations for sensitive users.'],
      ['aria-required purpose', 'Tells assistive tech that a form field must be filled in.'],
      ['role="dialog" usage', 'Marks a modal so screen readers announce it correctly.'],
      ['What is a11y shorthand?', 'Abbreviation for accessibility — 11 letters between a and y.'],
      ['WCAG 2.1 vs 2.2', '2.2 adds criteria for cognitive and mobile accessibility.'],
    ],
    // 8: Design Patterns
    [
      ['What is a Singleton?', 'A pattern ensuring a class has only one instance.'],
      ['What is a Factory?', 'A pattern that creates objects without specifying the exact class.'],
      ['What is an Observer?', 'A pattern where subscribers are notified of state changes.'],
      ['What is a Decorator?', 'A pattern that wraps an object to add behaviour dynamically.'],
      ['What is a Strategy?', 'A pattern that selects an algorithm at runtime.'],
      ['What is a Command?', 'Encapsulates a request as an object, allowing undo/redo.'],
      ['What is a Facade?', 'Provides a simplified interface to a complex subsystem.'],
      ['What is an Adapter?', 'Converts one interface to another that a client expects.'],
      ['What is a Proxy?', 'Controls access to another object.'],
      ['What is a Builder?', 'Constructs complex objects step by step.'],
      ['What is MVC?', 'Model-View-Controller — separates data, UI, and logic.'],
      ['What is MVVM?', 'Model-View-ViewModel — popularised by Angular and WPF.'],
      ['What is dependency injection?', 'Passing dependencies into a class rather than creating them inside.'],
      ['What is composition over inheritance?', 'Favouring object composition to build reusable behaviours.'],
      ['What is a mediator?', 'A pattern that centralises communication between components.'],
      ['What is a repository pattern?', 'Abstracts data access logic behind a collection-like interface.'],
      ['What is a circuit breaker?', 'Prevents repeated calls to a failing service by short-circuiting.'],
      ['What is event sourcing?', 'Storing state as a sequence of events rather than current values.'],
      ['What is CQRS?', 'Separates read (query) and write (command) models.'],
      ['What is the module pattern?', 'Uses closures to encapsulate private state in JavaScript.'],
    ],
    // 9: HTTP & REST APIs
    [
      ['What is HTTP?', 'HyperText Transfer Protocol — the foundation of web data exchange.'],
      ['GET vs POST', 'GET retrieves data; POST submits data to be processed.'],
      ['PUT vs PATCH', 'PUT replaces a resource; PATCH partially updates it.'],
      ['HTTP 200 meaning', 'OK — the request succeeded.'],
      ['HTTP 201 meaning', 'Created — a new resource was successfully created.'],
      ['HTTP 400 meaning', 'Bad Request — the server could not understand the request.'],
      ['HTTP 401 meaning', 'Unauthorized — authentication is required.'],
      ['HTTP 403 meaning', 'Forbidden — authenticated but not authorised.'],
      ['HTTP 404 meaning', 'Not Found — the resource does not exist.'],
      ['HTTP 500 meaning', 'Internal Server Error — the server encountered an unexpected condition.'],
      ['What is REST?', 'An architectural style using stateless HTTP for APIs.'],
      ['What is idempotency?', 'Repeating a request produces the same result — GET, PUT, DELETE.'],
      ['What is HATEOAS?', 'REST constraint where responses include links to related actions.'],
      ['What is content negotiation?', 'Client and server agree on the response format via Accept headers.'],
      ['What is rate limiting?', 'Restricting how many requests a client can make in a time window.'],
      ['What is pagination?', 'Breaking large datasets into pages using limit/offset or cursors.'],
      ['What is caching?', 'Storing responses to avoid redundant processing on repeat requests.'],
      ['ETag header purpose', 'A unique identifier for a resource version used for caching.'],
      ['What is an API key?', 'A token used to authenticate a client making API requests.'],
      ['What is a webhook?', 'An HTTP callback that notifies a URL when an event occurs.'],
    ],
  ];

  const bobCards = [
    // 0: PostgreSQL
    [
      ['What is a PRIMARY KEY?', 'A column (or set) that uniquely identifies each row.'],
      ['What is a FOREIGN KEY?', 'A column that references the primary key of another table.'],
      ['SELECT purpose', 'Retrieves rows from one or more tables.'],
      ['WHERE clause', 'Filters rows based on a condition.'],
      ['JOIN types', 'INNER, LEFT, RIGHT, FULL OUTER — differ in how NULLs are handled.'],
      ['What is an index?', 'A data structure that speeds up row lookups.'],
      ['EXPLAIN ANALYZE purpose', 'Shows the query plan and actual execution time.'],
      ['What is a transaction?', 'A group of SQL statements executed atomically.'],
      ['ACID properties', 'Atomicity, Consistency, Isolation, Durability.'],
      ['What is SERIAL?', 'Auto-incrementing integer type — shorthand for sequence + default.'],
      ['ON DELETE CASCADE', 'Automatically deletes child rows when the parent is deleted.'],
      ['What is a view?', 'A saved query treated as a virtual table.'],
      ['COALESCE purpose', 'Returns the first non-NULL value in a list.'],
      ['What is a CTE?', 'Common Table Expression — a named subquery using WITH.'],
      ['DISTINCT purpose', 'Removes duplicate rows from a result set.'],
      ['GROUP BY purpose', 'Aggregates rows sharing a value, used with COUNT, SUM, etc.'],
      ['HAVING vs WHERE', 'HAVING filters after aggregation; WHERE filters before.'],
      ['What is VACUUM?', 'Reclaims storage from dead tuples in Postgres.'],
      ['pg_dump purpose', 'Creates a backup of a Postgres database.'],
      ['What is connection pooling?', 'Reusing database connections to reduce overhead.'],
    ],
    // 1: Python Basics
    [
      ['What is Python?', 'A high-level, interpreted, general-purpose programming language.'],
      ['List vs tuple', 'Lists are mutable; tuples are immutable.'],
      ['What is a dictionary?', 'A key-value data structure with O(1) average lookup.'],
      ['List comprehension syntax', '[expr for item in iterable if condition]'],
      ['What is a lambda?', 'An anonymous function defined with the lambda keyword.'],
      ['*args purpose', 'Allows a function to accept any number of positional arguments.'],
      ['**kwargs purpose', 'Allows a function to accept any number of keyword arguments.'],
      ['What is a decorator?', 'A function that wraps another function to extend its behaviour.'],
      ['What is a generator?', 'A function using yield to lazily produce values one at a time.'],
      ['with statement purpose', 'Manages resources, calling __enter__ and __exit__ automatically.'],
      ['What is PEP 8?', 'The official Python style guide.'],
      ['What is a virtual environment?', 'An isolated Python environment for project dependencies.'],
      ['pip purpose', 'Installs and manages Python packages.'],
      ['What is __init__.py?', 'Marks a directory as a Python package.'],
      ['str vs bytes', 'str is text; bytes is raw binary data.'],
      ['What is slicing?', 'Extracting a sub-sequence: list[start:stop:step].'],
      ['What is duck typing?', 'Type checking by behaviour rather than explicit type.'],
      ['What is None?', 'Python\'s null value — equivalent to null in other languages.'],
      ['is vs ==', 'is checks identity (same object); == checks equality.'],
      ['What is the GIL?', 'Global Interpreter Lock — prevents true multi-threaded CPU parallelism.'],
    ],
    // 2: Docker & Containers
    [
      ['What is Docker?', 'A platform for building, running, and shipping containers.'],
      ['What is a container?', 'A lightweight, isolated runtime environment for an application.'],
      ['What is a Docker image?', 'A read-only template used to create containers.'],
      ['Dockerfile purpose', 'A script of instructions to build a Docker image.'],
      ['docker build command', 'Builds an image from a Dockerfile.'],
      ['docker run command', 'Creates and starts a container from an image.'],
      ['docker ps purpose', 'Lists running containers.'],
      ['docker stop purpose', 'Gracefully stops a running container.'],
      ['What is a volume?', 'Persistent storage mounted into a container.'],
      ['What is Docker Compose?', 'A tool to define and run multi-container apps with a YAML file.'],
      ['EXPOSE instruction', 'Documents which port the container listens on at runtime.'],
      ['ENV instruction', 'Sets environment variables inside the image.'],
      ['COPY vs ADD', 'COPY is preferred; ADD also handles URLs and tar extraction.'],
      ['What is a registry?', 'A storage and distribution system for Docker images (e.g. Docker Hub).'],
      ['docker exec purpose', 'Runs a command inside a running container.'],
      ['What are layers?', 'Each Dockerfile instruction adds a read-only layer to the image.'],
      ['What is a bind mount?', 'Maps a host directory into a container at runtime.'],
      ['docker logs purpose', 'Fetches logs from a container\'s stdout/stderr.'],
      ['What is Docker network?', 'A virtual network allowing containers to communicate.'],
      ['What is multi-stage build?', 'Uses multiple FROM instructions to produce a smaller final image.'],
    ],
    // 3: Linux Command Line
    [
      ['ls -la purpose', 'Lists all files including hidden ones with permissions and sizes.'],
      ['cd ~ purpose', 'Changes directory to the current user\'s home directory.'],
      ['pwd purpose', 'Prints the current working directory.'],
      ['grep purpose', 'Searches for a pattern in files or input.'],
      ['grep -r usage', 'Recursively searches all files in a directory.'],
      ['chmod purpose', 'Changes file permissions.'],
      ['chown purpose', 'Changes file owner and group.'],
      ['cat purpose', 'Outputs file contents to stdout.'],
      ['tail -f purpose', 'Continuously streams the end of a file (useful for logs).'],
      ['pipe | usage', 'Sends the output of one command as input to another.'],
      ['> vs >>', '> overwrites a file; >> appends to it.'],
      ['What is a symlink?', 'A file that points to another file or directory path.'],
      ['find command purpose', 'Searches the filesystem for files matching criteria.'],
      ['kill command purpose', 'Sends a signal to a process, commonly to terminate it.'],
      ['ps aux purpose', 'Lists all running processes with user and CPU info.'],
      ['df -h purpose', 'Shows disk space usage in human-readable format.'],
      ['du -sh purpose', 'Shows total size of a directory in human-readable format.'],
      ['ssh purpose', 'Opens a secure shell connection to a remote machine.'],
      ['What is cron?', 'A time-based job scheduler for running scripts automatically.'],
      ['What is a shebang?', '#!/bin/bash at the top of a script specifies the interpreter.'],
    ],
    // 4: Data Structures
    [
      ['What is an array?', 'A contiguous collection of elements accessed by index.'],
      ['What is a linked list?', 'A sequence of nodes where each node points to the next.'],
      ['What is a stack?', 'A LIFO structure — last in, first out.'],
      ['What is a queue?', 'A FIFO structure — first in, first out.'],
      ['What is a hash map?', 'A key-value store with O(1) average lookup via hashing.'],
      ['What is a binary tree?', 'A tree where each node has at most two children.'],
      ['What is a BST?', 'A binary tree where left < parent < right for all nodes.'],
      ['What is a heap?', 'A complete binary tree satisfying the heap property (min or max).'],
      ['What is a graph?', 'A collection of nodes connected by edges.'],
      ['What is a trie?', 'A tree for storing strings, where each node is a character.'],
      ['What is a set?', 'A collection of unique elements with O(1) lookup.'],
      ['DFS purpose', 'Depth-First Search — explores as deep as possible before backtracking.'],
      ['BFS purpose', 'Breadth-First Search — explores all neighbours before going deeper.'],
      ['O(1) meaning', 'Constant time — does not grow with input size.'],
      ['O(n) meaning', 'Linear time — grows proportionally with input size.'],
      ['O(log n) meaning', 'Logarithmic time — halves the problem each step, e.g. binary search.'],
      ['O(n²) meaning', 'Quadratic time — common in nested loops.'],
      ['What is amortised cost?', 'The average cost per operation over a sequence of operations.'],
      ['What is a deque?', 'A double-ended queue allowing insertion and removal at both ends.'],
      ['What is dynamic array?', 'An array that resizes itself when capacity is exceeded.'],
    ],
    // 5: Algorithms
    [
      ['Bubble sort complexity', 'O(n²) time, O(1) space — swaps adjacent elements repeatedly.'],
      ['Merge sort complexity', 'O(n log n) time, O(n) space — divide and conquer.'],
      ['Quick sort complexity', 'O(n log n) average, O(n²) worst — partitions around a pivot.'],
      ['Binary search requirement', 'The array must be sorted; complexity is O(log n).'],
      ['What is memoisation?', 'Caching the results of expensive function calls.'],
      ['What is dynamic programming?', 'Breaking a problem into overlapping subproblems and caching results.'],
      ['What is a greedy algorithm?', 'Makes the locally optimal choice at each step.'],
      ['What is backtracking?', 'Explores all options and abandons invalid paths early.'],
      ['What is recursion?', 'A function that calls itself with a smaller subproblem.'],
      ['Base case importance', 'Stops infinite recursion — the simplest form of the problem.'],
      ['What is a pivot?', 'The element around which Quick Sort partitions the array.'],
      ['Stable sort definition', 'Preserves the relative order of equal elements.'],
      ['What is a sliding window?', 'A technique using two pointers to process subarrays in O(n).'],
      ['Two-pointer technique', 'Uses two indices moving toward each other to solve array problems.'],
      ['Kadane\'s algorithm', 'Finds the maximum subarray sum in O(n) time.'],
      ['What is a topological sort?', 'Orders nodes of a DAG so all edges point forward.'],
      ['Dijkstra\'s algorithm', 'Finds shortest paths from a source node in a weighted graph.'],
      ['What is a DAG?', 'A Directed Acyclic Graph — no cycles, edges have direction.'],
      ['In-order traversal', 'Left → Root → Right — produces sorted output on a BST.'],
      ['What is Big O notation?', 'Describes how an algorithm\'s cost scales with input size.'],
    ],
    // 6: AWS Cloud Basics
    [
      ['What is EC2?', 'Elastic Compute Cloud — virtual machines in the cloud.'],
      ['What is S3?', 'Simple Storage Service — scalable object storage.'],
      ['What is IAM?', 'Identity and Access Management — controls AWS permissions.'],
      ['What is a VPC?', 'Virtual Private Cloud — isolated network in AWS.'],
      ['What is Lambda?', 'A serverless function service — run code without managing servers.'],
      ['What is RDS?', 'Relational Database Service — managed SQL databases.'],
      ['What is CloudFront?', 'A CDN that delivers content with low latency globally.'],
      ['What is Route 53?', 'AWS\'s scalable DNS and domain registration service.'],
      ['What is an AMI?', 'Amazon Machine Image — a template for launching EC2 instances.'],
      ['What is Auto Scaling?', 'Automatically adjusts instance count based on demand.'],
      ['What is an ELB?', 'Elastic Load Balancer — distributes traffic across instances.'],
      ['What is SQS?', 'Simple Queue Service — managed message queuing.'],
      ['What is SNS?', 'Simple Notification Service — pub/sub messaging.'],
      ['What is CloudWatch?', 'Monitoring and observability service for AWS resources.'],
      ['What is ECS?', 'Elastic Container Service — runs Docker containers on AWS.'],
      ['What is EKS?', 'Elastic Kubernetes Service — managed Kubernetes on AWS.'],
      ['What is DynamoDB?', 'A fully managed NoSQL key-value and document database.'],
      ['What is the shared responsibility model?', 'AWS manages infrastructure; customer manages data and access.'],
      ['What are availability zones?', 'Isolated data centre locations within an AWS region.'],
      ['What is a region?', 'A geographic area containing multiple availability zones.'],
    ],
    // 7: GraphQL
    [
      ['What is GraphQL?', 'A query language and runtime for APIs developed by Meta.'],
      ['Query vs mutation', 'Queries read data; mutations write or modify data.'],
      ['What is a schema?', 'Defines the types and relationships available in a GraphQL API.'],
      ['What is a resolver?', 'A function that fetches the data for a specific field.'],
      ['What is the N+1 problem?', 'When resolving a list triggers one extra query per item.'],
      ['What is DataLoader?', 'A batching and caching utility that solves the N+1 problem.'],
      ['What is a subscription?', 'A real-time GraphQL operation that pushes data when events occur.'],
      ['What is introspection?', 'Querying a GraphQL API to discover its schema and types.'],
      ['Fragments purpose', 'Reusable selections of fields that avoid duplication.'],
      ['Variables in GraphQL', 'Parameterise queries to avoid string interpolation.'],
      ['Inline fragments', 'Select fields on a type within a union or interface.'],
      ['What is a union type?', 'A type that can be one of several object types.'],
      ['What is an interface?', 'Defines shared fields that multiple types must implement.'],
      ['Scalar types in GraphQL', 'Primitives: Int, Float, String, Boolean, ID.'],
      ['What is __typename?', 'A meta-field returning the type name of an object.'],
      ['What is persisted queries?', 'Pre-registered queries sent by ID to reduce payload size.'],
      ['Apollo Client purpose', 'A popular GraphQL client for caching and state management.'],
      ['What is schema stitching?', 'Combining multiple GraphQL schemas into one.'],
      ['What is a directive?', 'Annotates schema or queries with custom logic, e.g. @deprecated.'],
      ['REST vs GraphQL', 'GraphQL lets clients request exactly what they need; REST is fixed-shape.'],
    ],
    // 8: System Design
    [
      ['What is scalability?', 'The ability of a system to handle growing amounts of work.'],
      ['Horizontal vs vertical scaling', 'Horizontal adds more machines; vertical adds more power to one.'],
      ['What is a load balancer?', 'Distributes incoming requests across multiple servers.'],
      ['What is a CDN?', 'A network of servers caching content close to users.'],
      ['What is caching?', 'Storing frequently accessed data in fast storage.'],
      ['What is a message queue?', 'Decouples producers and consumers using async messaging.'],
      ['What is a microservice?', 'A small, independently deployable service with a single responsibility.'],
      ['What is a monolith?', 'A single deployable unit containing all application logic.'],
      ['What is sharding?', 'Splitting a database into smaller, independent parts.'],
      ['What is replication?', 'Copying data to multiple nodes for redundancy or read scaling.'],
      ['CAP theorem', 'A distributed system can guarantee only 2 of: Consistency, Availability, Partition tolerance.'],
      ['What is eventual consistency?', 'Replicas will converge to the same state given enough time.'],
      ['What is a reverse proxy?', 'Sits in front of servers to route, cache, or terminate TLS.'],
      ['What is rate limiting?', 'Restricting how often a client can call an API.'],
      ['What is a circuit breaker?', 'Stops calls to a failing service to allow it to recover.'],
      ['What is an SLA?', 'Service Level Agreement — a commitment to uptime or performance.'],
      ['What is idempotency?', 'An operation that produces the same result no matter how many times it runs.'],
      ['What is a write-through cache?', 'Writes go to cache and database simultaneously.'],
      ['What is consistent hashing?', 'Distributes keys across nodes minimising remapping when nodes change.'],
      ['What is the two-phase commit?', 'A protocol ensuring all nodes in a transaction agree before committing.'],
    ],
    // 9: Regex Patterns
    [
      ['What is regex?', 'A pattern language for matching text strings.'],
      ['. in regex', 'Matches any character except a newline.'],
      ['* in regex', 'Matches zero or more of the preceding element.'],
      ['+ in regex', 'Matches one or more of the preceding element.'],
      ['? in regex', 'Matches zero or one of the preceding element (also makes * and + lazy).'],
      ['^  in regex', 'Anchors the match to the start of a string.'],
      ['$ in regex', 'Anchors the match to the end of a string.'],
      ['\\d meaning', 'Matches any digit — equivalent to [0-9].'],
      ['\\w meaning', 'Matches any word character: [a-zA-Z0-9_].'],
      ['\\s meaning', 'Matches any whitespace character.'],
      ['[] character class', 'Matches any one character inside the brackets.'],
      ['[^] negated class', 'Matches any character NOT inside the brackets.'],
      ['{n,m} quantifier', 'Matches between n and m repetitions of the preceding element.'],
      ['() grouping', 'Captures a sub-expression for back-references or alternation.'],
      ['| alternation', 'Matches the expression on the left or the right.'],
      ['\\b word boundary', 'Matches the position between a word character and a non-word character.'],
      ['Lookahead (?=...)', 'Asserts what follows without consuming characters.'],
      ['Lookbehind (?<=...)', 'Asserts what precedes without consuming characters.'],
      ['Greedy vs lazy matching', 'Greedy takes as much as possible; lazy (?) takes as little as possible.'],
      ['Flags: g, i, m', 'g = global, i = case-insensitive, m = multiline anchors.'],
    ],
  ];

  // --- Insert decks for Alice ---
  const insertedAliceDecks = [];
  for (const deck of aliceDecks) {
    const { rows } = await pool.query(
      `INSERT INTO decks (title, description, is_public, user_id)
       VALUES ($1, $2, $3, $4) RETURNING deck_id, title`,
      [deck.title, deck.description, deck.is_public, alice.user_id]
    );
    insertedAliceDecks.push(rows[0]);
  }

  // --- Insert decks for Bob ---
  const insertedBobDecks = [];
  for (const deck of bobDecks) {
    const { rows } = await pool.query(
      `INSERT INTO decks (title, description, is_public, user_id)
       VALUES ($1, $2, $3, $4) RETURNING deck_id, title`,
      [deck.title, deck.description, deck.is_public, bob.user_id]
    );
    insertedBobDecks.push(rows[0]);
  }

  // --- Insert cards for Alice's decks ---
  for (let i = 0; i < insertedAliceDecks.length; i++) {
    const deckId = insertedAliceDecks[i].deck_id;
    for (const [front, back] of aliceCards[i]) {
      await pool.query(
        `INSERT INTO cards (front, back, deck_id) VALUES ($1, $2, $3)`,
        [front, back, deckId]
      );
    }
  }

  // --- Insert cards for Bob's decks ---
  for (let i = 0; i < insertedBobDecks.length; i++) {
    const deckId = insertedBobDecks[i].deck_id;
    for (const [front, back] of bobCards[i]) {
      await pool.query(
        `INSERT INTO cards (front, back, deck_id) VALUES ($1, $2, $3)`,
        [front, back, deckId]
      );
    }
  }

  return users;
};

seed()
  .then((users) => {
    console.log('Database seeded successfully.');
    console.log(`  Users: ${users.map((u) => u.username).join(', ')}`);
  })
  .catch((err) => {
    console.error('Error seeding database:', err);
    process.exit(1);
  })
  .finally(() => pool.end());