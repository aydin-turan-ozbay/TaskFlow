import { useState } from 'react'
import Header from '../components/Header'
import TaskForm from '../components/TaskForm'
import TaskList from '../components/TaskList'
import { getTasks, saveTasks } from '../services/taskStorage'

function Dashboard() {

  // Görev ekleme formunun görünürlük durumunu tutar.
  const [showTaskForm, setShowTaskForm] = useState(false)

  // Düzenlenmek üzere seçilen görevi tutar.
  // null değeri, yeni görev oluşturma modunu ifade eder.
  const [editingTask, setEditingTask] = useState(null)

  // Uygulama açıldığında kayıtlı görevleri LocalStorage'dan okur.
  // Okuma başarısız olursa görev listesi null olarak tutulur.
  const [tasks, setTasks] = useState(() => {
    const result = getTasks()
    return result.success ? result.tasks : null
  })

  // Kullanıcının seçtiği görev durumu filtresini tutar.
  // 'all' değeri bütün görevlerin görüntülenmesini sağlar.
  const [statusFilter, setStatusFilter] = useState('all')

  // Kullanıcının seçtiği öncelik filtresini tutar.
  // 'all' seçeneği bütün öncelik seviyelerini kapsar.
  const [priorityFilter, setPriorityFilter] = useState('all')

  // Kullanıcının görev aramak için yazdığı metni tutar.
  const [searchQuery, setSearchQuery] = useState('')

  // Kullanıcının seçtiği görev sıralama kriterini tutar.
  const [sortBy, setSortBy] = useState('newest')

  // Kullanıcıya gösterilecek işlem mesajını tutar.
  const [message, setMessage] = useState('')
 


  // Yeni görev oluşturma formunu açar.
  function handleOpenForm() {
    setEditingTask(null)
    setMessage('')
    setShowTaskForm(true)
  }

  // Formu kapatır ve düzenleme seçimini temizler.
  function handleCloseForm() {
    setShowTaskForm(false)
    setEditingTask(null)
  }

  // Edit butonundan gelen görevi düzenleme için seçer.
  function handleEditTask(task) {
    setEditingTask(task)
    setMessage('')
    setShowTaskForm(true)
  }

  // TaskForm'dan gelen verilerle yeni bir görev oluşturur.
  function handleAddTask(taskData) {
    // Kayıtlı görevler okunamadıysa üzerine yazmayı engeller.
    if (tasks === null) {
      setMessage('Tasks could not be loaded. Saving is disabled.')
      return
    }

    const now = new Date().toISOString()

    // Formdan gelen durum bilgisi korunarak yeni görev oluşturulur.
    const newTask = {
      id: crypto.randomUUID(),
      ...taskData,
      createdAt: now,
      updatedAt: now
    }

    // Mevcut görevleri değiştirmeden yeni görevle bir liste oluşturur.
    const updatedTasks = [...tasks, newTask]

    // Önce LocalStorage'a kaydeder; başarılıysa React state'i günceller.
    const isSaved = saveTasks(updatedTasks)

    if (!isSaved) {
      setMessage('Task could not be saved. Please try again.')
      return
    }

    setTasks(updatedTasks)
    setShowTaskForm(false)
    setMessage('Task created successfully.')

    console.log('Task saved successfully:', newTask)
  }

  // Seçilen görevin bilgilerini günceller.
  function handleUpdateTask(taskData) {
    // Kayıtlı görevler okunamadıysa güncellemeyi engeller.
    if (tasks === null || editingTask === null) {
      setMessage('Task could not be updated.')
      return
    }

    // Güncellenecek görevin hâlâ listede bulunduğunu kontrol eder.
    const taskExists = tasks.some(
      (task) => task.id === editingTask.id
    )

    if (!taskExists) {
      setMessage('Task not found.')
      return
    }

    const now = new Date().toISOString()

    // Yalnızca seçilen görevin bilgilerini değiştirir.
    // Görevin ID ve oluşturulma tarihi korunur.
    const updatedTasks = tasks.map((task) => {
      if (task.id === editingTask.id) {
        return {
          ...task,
          ...taskData,
          updatedAt: now
        }
      }

      return task
    })

    // Önce LocalStorage'a kaydeder, başarılıysa ekranı günceller.
    const isSaved = saveTasks(updatedTasks)

    if (!isSaved) {
      setMessage('Task could not be updated. Please try again.')
      return
    }

    setTasks(updatedTasks)
    setShowTaskForm(false)
    setEditingTask(null)
    setMessage('Task updated successfully.')

    console.log('Task updated successfully:', editingTask.id)
  }

  // Kullanıcının seçtiği görevi kimliğine göre siler.
  function handleDeleteTask(taskId) {
    // LocalStorage okuma hatası varsa silme işlemini engeller.
    if (tasks === null) {
      setMessage('Tasks could not be loaded. Deleting is disabled.')
      return
    }

    // Silinecek görev dışındaki görevlerle yeni bir liste oluşturur.
    const updatedTasks = tasks.filter((task) => task.id !== taskId)

    // Görev bulunamadıysa gereksiz kayıt işlemini engeller.
    if (updatedTasks.length === tasks.length) {
      setMessage('Task not found.')
      return
    }

    // Önce LocalStorage'ı günceller; başarılıysa React state'ini değiştirir.
    const isSaved = saveTasks(updatedTasks)

    if (!isSaved) {
      setMessage('Task could not be deleted. Please try again.')
      return
    }

    setTasks(updatedTasks)
    setMessage('Task deleted successfully.')

    console.log('Task deleted successfully:', taskId)
  }

  // Görevleri arama metni, durum ve öncelik kriterlerine göre filtreler.
  // Orijinal görev listesi ve LocalStorage değiştirilmez.
  const filteredTasks = tasks === null
    ? null
    : tasks.filter((task) => {
        const query = searchQuery.trim().toLowerCase()

        // Başlık veya açıklamada aranan metnin bulunup bulunmadığını kontrol eder.
        const matchesSearch =
          task.title.toLowerCase().includes(query) ||
          (task.description || '').toLowerCase().includes(query)

        const matchesStatus =
          statusFilter === 'all' || task.status === statusFilter

        const matchesPriority =
          priorityFilter === 'all' || task.priority === priorityFilter

        // Görev, seçilen bütün kriterleri karşılıyorsa görüntülenir.
        return matchesSearch && matchesStatus && matchesPriority
      })

  // Filtrelenmiş görevleri seçilen kritere göre sıralar.
  // Kopya dizi kullanıldığı için orijinal görev listesi değişmez.
  const sortedTasks = filteredTasks === null
    ? null
    : [...filteredTasks].sort((a, b) => {
        switch (sortBy) {
          case 'oldest':
            return a.createdAt.localeCompare(b.createdAt)

          case 'dueDate':
            // Tarihi belirtilmeyen görevleri listenin sonuna taşır.
            if (!a.dueDate && !b.dueDate) return 0
            if (!a.dueDate) return 1
            if (!b.dueDate) return -1

            return a.dueDate.localeCompare(b.dueDate)

          case 'priority': {
            // Öncelik seviyelerini sayısal değerlere dönüştürür.
            const priorityOrder = {
              high: 3,
              medium: 2,
              low: 1
            }

            return (
              (priorityOrder[b.priority] ?? 0) -
              (priorityOrder[a.priority] ?? 0)
            )
          }

          case 'newest':
          default:
            return b.createdAt.localeCompare(a.createdAt)
        }
      })

  return (
    <>
      <Header />

      <main className="container py-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="h4 mb-1">My Tasks</h2>
            <p className="text-muted mb-0">
              Manage and track your tasks
            </p>
          </div>

          <button
            className="btn btn-primary"
            onClick={handleOpenForm}
            disabled={tasks === null}
          >
            + Add New Task
          </button>
        </div>

        {/* Okuma veya kayıt sonucuna göre kullanıcıya geri bildirim verir. */}
        {message && (
          <div
            className={`alert ${
              message === 'Task created successfully.' ||
              message === 'Task deleted successfully.' ||
              message === 'Task updated successfully.'
                ? 'alert-success'
                : 'alert-danger'
            }`}
            role="alert"
          >
            {message}
          </div>
        )}

        {/* LocalStorage okuma hatasında veri kaybını önlemek için
            görev oluşturma işlemini devre dışı bırakır. */}
        {tasks === null && (
          <div className="alert alert-danger" role="alert">
            Tasks could not be loaded from local storage.
            Please check the browser console.
          </div>
        )}
        
        {/* Form yalnızca kullanıcı istediğinde görüntülenir. */}
        {showTaskForm && (
          <div className="row mb-4">
            <div className="col-12 col-md-8 col-lg-6">
              
              {/* Form, seçilen göreve göre ekleme veya düzenleme modunda açılır. */}
              <TaskForm
                key={editingTask?.id ?? 'new-task'}
                task={editingTask}
                onSubmit={editingTask ? handleUpdateTask : handleAddTask}
                onCancel={handleCloseForm}
              />

            </div>
          </div>
        )}
        
        {/* Kullanıcının görevleri durumlarına göre filtrelemesini ve sıralamasını sağlar. */}
        {tasks !== null && (
          <div className="row mb-4">

            <div className="col-12 col-md-4">

              {/* Görevleri başlık veya açıklama bilgisine göre arar. */}
              <div className="col-12 mb-3">
                <label htmlFor="searchQuery" className="form-label">
                  Search Tasks
                </label>

                <input
                  type="text"
                  id="searchQuery"
                  className="form-control"
                  placeholder="Search by title or description..."
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                />
              </div>

              <label htmlFor="statusFilter" className="form-label">
                Filter by Status
              </label>

              <select
                id="statusFilter"
                className="form-select"
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
              >
                <option value="all">All Tasks</option>
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>


            {/* Kullanıcının görevleri önceliklerine göre filtrelemesini sağlar. */}
            <div className="col-12 col-md-4">
              <label htmlFor="priorityFilter" className="form-label">
                Filter by Priority
              </label>

              <select
                id="priorityFilter"
                className="form-select"
                value={priorityFilter}
                onChange={(event) => setPriorityFilter(event.target.value)}
              >
                <option value="all">All Priorities</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            {/* Görevlerin görüntülenme sırasını belirler. */}
            <div className="col-12 col-md-4">
              <label htmlFor="sortBy" className="form-label">
                Sort By
              </label>

              <select
                id="sortBy"
                className="form-select"
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="dueDate">Due Date (Earliest)</option>
                <option value="priority">Priority (High to Low)</option>
              </select>
            </div>


          </div>
        )}

        {/* Görev listesini ve düzenleme/silme fonksiyonlarını TaskList'e aktarır.
            LocalStorage okuma hatası varsa görev listesi görüntülenmez.
            Seçilen filtreye uygun görevleri listeler. */}
        {sortedTasks !== null && (
          <TaskList
            tasks={sortedTasks}
            onDelete={handleDeleteTask}
            onEdit={handleEditTask}
          />
        )}

      </main>
    </>
  )
}

export default Dashboard
