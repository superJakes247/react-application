
import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Header from './components/Header'
import Tasks from './components/Tasks'
import AddTask from './components/AddTask'
import Footer from './components/Footer'
import About from './components/About'

function App() {
  const [showAddTask, setShowAddTask] = useState(false)
  const [tasks, setTasks] = useState([])

  useEffect(() => {
    const getTasks = async () => {
      const tasksFromServer = await fetchTasks()
      setTasks(tasksFromServer)
    }
    getTasks()
  }, []);

  // Fetch all tasks from json-server
  const fetchTasks = async () => {
    const res = await fetch('http://localhost:5000/tasks')
    const data = await res.json()
    return data
  }

  // Fetch a single task from json-server
  const fetchTask = async (id) => {
    const res = await fetch(`http://localhost:5000/tasks/${id}`)
    const data = await res.json()
    return data
  }

  //Add Task
  const addTask = async (task) => {
    const res = await fetch('http://localhost:5000/tasks',
      {
        method: 'POST',
        body: JSON.stringify(task),
        headers: { 'Content-type': 'application/json' }
      })

    const newTask = await res.json();
    setTasks([...tasks, newTask])

    // commenting out the below code, as its only for UI
    // const id = Math.floor(Math.random() * 10000 + 1)
    // const newTask = { id, ...task }
    // setTasks([...tasks, newTask])
  }

  // Delete Task
  const deleteTask = async (id) => {
    // delete from server
    await fetch(`http://localhost:5000/tasks/${id}`, { method: 'DELETE' })

    // delete from state (UI)
    setTasks(tasks.filter((task) => task.id !== id))
  }

  // Toggle Reminder
  const toggleReminder = async (id) => {
    // update task in json-server
    const taskToUpdate = await fetchTask(id);
    const taskUpdated = { ...taskToUpdate, reminder: !taskToUpdate.reminder }
    const res = await fetch(`http://localhost:5000/tasks/${id}`,
      {
        method: 'PUT',
        body: JSON.stringify(taskUpdated),
        headers: { 'Content-type': 'application/json' }
      })
    const updatedTask = await res.json()

    // update task in state (UI)
    setTasks(tasks.map((task) => task.id === id ? { ...task, reminder: updatedTask.reminder } : task))
  }

  return (
    <Router>
      <div className="container">
        <Header onAdd={() => setShowAddTask(!showAddTask)} showAdd={showAddTask} />
        <Routes>
          <Route
            path='/'
            element={<>
              {showAddTask && <AddTask onAdd={addTask} />}
              {tasks.length > 0 ? <Tasks tasks={tasks} onDelete={deleteTask} onToggle={toggleReminder} /> : 'No tasks to show'}
            </>}
          />
          <Route path='/About' element={<About />} />
        </Routes>
        <Footer></Footer>
      </div>
    </Router>
  );
}

export default App;
