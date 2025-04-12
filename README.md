# Conway's Game of Life - Documentation

## Problem Description

Write a React front end application that implements simulating Conway’s Game of Life [Conway's Game
of Life - Wikipedia](https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life)

Create a UI that has:

1. A board that allows turning on and off squares
2. A way to advance to the next state
3. A way to play forever the next states
4. A way to advance x number of states

With a normal web service there might be an API, but the React app should take the place of the API.
Include all code to simulate the Game of Life but treat that code as if it were going to be called from an API. Do not implement a backend API, unless you want to.

This could take four to five hours. The implementation should be production ready. You don’t need to
implement any authentication/authorization. Be ready to discuss your solution.

---

## Steps to run the code locally

1. **Clone the Repository**

```bash
git clone https://github.com/amaury14/game-of-life
cd game-of-life
```

2. **Install Dependencies**

Make sure you have [Node.js](https://nodejs.org/) (preferably v20) and [npm](https://www.npmjs.com/) installed.

```bash
npm install
```

3. **Run the App**

```bash
npm run start
```

This will start the development server and open a new browser tab with the application. If no tab opens automatically, open it in your browser at: [localhost:3000](http://localhost:3000)

4. **Run Tests**
To execute unit and integration tests:

```bash
npm run test
```

5. **Build for Production**

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

```bash
npm run build
```

## Steps to build and run the docker image

A Dockerfile has been included to enable containerization of the React application, allowing it to run within Docker environments if needed.

### 1. **Build the Docker Image**

Make sure you're in the project root directory, and run:

```bash
docker build -t game-of-life-app .
```

This will use the `Dockerfile` to build a production-ready image using Node 20.

### 2. **Run the Container**

```bash
docker run -p 8080:80 game-of-life-app
```

This exposes the app on `http://localhost:8080`.

### 3. **Optional: Run in Detached Mode**

```bash
docker run -d -p 8080:80 game-of-life-app
```

This will run the container in the background.

---

## CI/CD with GitHub Actions and Firebase Hosting

This project uses **GitHub Actions** and **Firebase Hosting** to automatically deploy the app to two separate environments: **development** and **production**.

### Pipelines

There are two GitHub Actions pipelines:

- `build`: Validates and builds the application.
- `deploy`: Deploys the app to Firebase Hosting, and determines the target environment based on the branch name.

### Deployment Stages

The deployment stage is selected based on the branch that is merged:

| Branch Pattern | Deployment Stage | URL                                      |
|----------------|------------------|-------------------------------------------|
| `main`         | Development       | [https://dev-game-of-life.web.app](https://dev-game-of-life.web.app/) |
| `release/**`   | Production        | [https://prod-game-of-life.web.app](https://prod-game-of-life.web.app/) |

- When code is merged into `main`, it is deployed to the **development** environment.
- When a branch matching `release/**` is merged, it triggers a deployment to the **production** environment.

### Authentication

Firebase deployments are handled securely using a **Google Service Account** and **OAuth authentication** configured in the GitHub Actions secrets.

This setup allows fully automated and secure deployments with no manual steps required.

---

## Explanation of the Solution and Thought Process for **Game of Life React App**

The **Game of Life** is a cellular automaton devised by mathematician John Conway. The goal of the game is to simulate the evolution of a grid of cells that follow specific rules to determine if a cell lives, dies, or evolves based on the number of neighboring cells that are alive. Here's a breakdown of how the Game of Life React app works, how I structured it, and the thought process behind building the app.

---

### **App Structure**

1. **Components Breakdown**:
   - **App**: The root component that sets up the main structure.
   - **Board**: The main component that displays the grid, handles user interactions (like toggling cells, starting, pausing, advancing generations), and manages the game logic (e.g., starting the simulation or advancing generations).
   - **Cell**: A reusable component that represents a single cell in the grid, which can either be "alive" or "dead".
   - **Controls**: Component that provides buttons for the user to interact with the game (start, pause, reset, advance generations).

2. **State Management**:
   - Was used **React Redux** for state management, which allows the application state (the grid, generations count, etc.) to be centralized and passed down through components.
   - **Redux Slice** (`gameSlice.ts`) defines the actions and reducers needed for interacting with the game grid.
   - The **grid** is stored in Redux as a 2D array of booleans (`true` for alive, `false` for dead).
   - The **generations count** tracks how many generations have passed.

---

### **Core Concepts in the App**

1. **Grid Representation**:
   - The grid is a 2D array (`boolean[][]`), where each element represents whether the cell is alive (`true`) or dead (`false`).
   - The grid is initialized in Redux with a defined number of rows and columns. The user can interact with the grid by toggling individual cells (turning them from dead to alive and vice versa).

2. **Game Logic**:
   - **Count Neighbors**: Each cell's state (alive or dead) depends on the number of its neighbors. This is computed using a `countNeighbors` function that looks at all eight neighboring cells around a given cell.
   - **Game Rules**: Based on Conway's rules:
     - A live cell with two or three neighbors stays alive.
     - A dead cell with exactly three neighbors becomes alive.
     - Any other configuration results in the cell being dead.
   - **Advancing Generations**: When advancing to the next generation, the app uses the `getNextGeneration` function to calculate the new grid state according to the rules.

3. **Interaction with the Board**:
   - **Toggle Cell**: Users can click on a cell to toggle its state (alive to dead or vice versa).
   - **Start Simulation**: When the user clicks "Start", a setInterval is used to simulate the advancement of generations at a fixed delay (200ms).
   - **Pause/Reset**: Users can pause the simulation or reset the grid to its initial state.
   - **Advanced X Generations**: Users can advance an X number of generations at a time.

4. **React Hooks**:
   - **useState**: This is used for local state management, like storing the interval ID for simulation.
   - **useEffect**: Used for handling side effects, like cleaning up intervals when the component unmounts.
   - **useDispatch** and **useSelector**: These hooks connect the app to Redux. `useDispatch` is used to dispatch actions (like toggling a cell or fetching the next generation), while `useSelector` retrieves state from Redux (like the grid or population count).

---

### **Approach to Testing**

1. **Unit Testing**:
   - Testing the individual utility functions like `countNeighbors`, `getNextGeneration`, and Redux reducers ensures that the underlying logic is correct.
   - Unit tests focus on verifying that the logic of the app works correctly in isolation, without worrying about the UI.

2. **Integration Testing**:
   - Integration tests ensure that different components work together as expected. For instance, testing that clicking a cell correctly toggles its state and that the population count updates after advancing generations.
   - **@testing-library/react** is used to render components, simulate user interactions, and assert that the UI behaves as expected.

3. **End-to-End Testing**:
   - In a full-fledged app, end-to-end tests would simulate user interactions from the UI's perspective. This type of test is typically run with tools like **Cypress** or **Puppeteer**.

---

### **Thought Process for Building the Game of Life App**

1. **User Interaction**:
   - I focused on making sure the game is intuitive to interact with — easy toggling of cells, starting/pausing the simulation, and adjusting the number of generations to advance.
   - Accessibility is a priority, so each cell has an `aria-label` that describes its state (alive or dead) and position in the grid.

2. **Performance Considerations**:
   - The grid can potentially grow large, so it's essential to keep the app performant. For large grids, avoid unnecessary re-renders. **React.memo** was used for the `Cell` component to avoid re-rendering cells that haven't changed.
   - **setInterval** is used for advancing the generations, but it's canceled if the game is paused to save resources.

3. **Redux**:
   - I chose to use Redux because it provides a centralized state for the grid and generation count, which makes it easier to manage complex state logic (especially as the game could evolve and include additional features, like persistent state).
   - Actions and reducers are cleanly separated, and Redux Toolkit's `createSlice` simplifies the setup of the Redux store.

---

### **Conclusion**

The Game of Life app in React was built with both simplicity and scalability in mind. By using Redux for state management and React hooks for side effects, the app's logic is cleanly separated from the UI. The game logic (such as calculating the next generation and toggling cell states) is modular and testable. The UI is designed to be interactive and easy to use, while the app is built to be performance-conscious.

---

## Assumptions and Trade-offs

### Assumptions

- **Grid Size is Fixed on Load**  
  The application assumes a fixed grid size (set by `initialRows: 40` and `initialCols: 80`) when the component mounts. Dynamic resizing of the grid is not currently supported.

- **Simulation Speed is Sufficient**  
  The delay between steps (`delayBetweenSteps: 200`) is assumed to be appropriate for most users. No user control for speed granularity is provided beyond setting steps and delay.

- **Client-Side Only Game Logic**  
  All logic related to Conway's Game of Life runs on the client. No server-side computation or persistence is assumed or implemented.

- **Synchronous State Management**  
  The app assumes that Redux state updates and actions (including async thunks) will complete in a timely manner and not conflict with interval-based updates.

- **Accessibility is Handled at a Basic Level**  
  Basic ARIA labels and keyboard accessibility are assumed to be sufficient for accessibility compliance, but the UI has not been fully audited for screen reader or keyboard-only usage.

---

### Trade-offs

- **Performance vs. Simplicity**  
  Grid updates are handled by re-rendering the entire grid using React components. While simple to implement and maintain, this approach may lead to performance bottlenecks with larger grids.

- **State Derivation in Selectors**  
  The `populationCount` is derived using a selector (`createSelector`), which avoids recalculation unless the grid changes. However, this assumes that the selector memoization remains efficient as the app scales.

- **No Persistent State**  
  Game state (grid, population, generation count) is not persisted between sessions. This simplifies the architecture but limits use cases such as "save and continue later."

- **GitHub Actions Deployment Strategy**  
  The two-stage deployment setup assumes a linear development flow: development merges to `main`, and production releases are tagged via `release/**`.

- **Firebase Hosting**  
  Firebase Hosting is used for ease of setup and integration with GitHub Actions, but may introduce vendor lock-in and has usage limits on the free tier.
