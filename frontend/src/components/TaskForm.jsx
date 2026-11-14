import { useState } from 'react'

 // Bugünün tarihini kullanıcının yerel saatine göre YYYY-MM-DD formatında döndürür.
function getTodayDate() {
  const today = new Date()

  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

 // Son teslim tarihi için bugünden 5 yıl sonrasını hesaplar.
function getMaxDueDate() {
  const today = new Date()
  const currentYear = today.getFullYear()

  // Yıl sınırını belirlerken 29 Şubat gibi özel tarihleri de dikkate alır.
  const maxYear = currentYear + 5
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(
    Math.min(
      today.getDate(),
      new Date(maxYear, today.getMonth() + 1, 0).getDate()
    )
  ).padStart(2, '0')

  return `${maxYear}-${month}-${day}`
}

// Formun başlangıç değerleri.
// Yeni görev oluşturulurken bu değerler kullanılır.
const initialFormData = {
  title: '',
  description: '',
  priority: 'medium',
  status: 'todo',
  assignee: '',
  dueDate: ''
}
// Form, yeni görev oluşturmak veya mevcut görevi düzenlemek için kullanılır.
function TaskForm({ task = null, onSubmit, onCancel }) {
  
  // Düzenleme modunda mevcut görev bilgilerini,
  // ekleme modunda ise boş başlangıç değerlerini kullanır.
  const [formData, setFormData] = useState(() => {
    if (task) {
      return {
        title: task.title,
        description: task.description,
        priority: task.priority,
        status: task.status,
        assignee: task.assignee,
        dueDate: task.dueDate || ''
      }
    }

    return { ...initialFormData }
  })

  // Düzenlenecek görev gönderilmişse form düzenleme modundadır.
  const isEditing = task !== null


  // Kullanıcı bir form alanını değiştirdiğinde ilgili değeri günceller.
  function handleChange(event) {
    const { name, value } = event.target

    setFormData((previousData) => ({
      ...previousData,
      [name]: value
    }))
  }

  // Form gönderildiğinde verileri kontrol edip üst bileşene iletir.
  function handleSubmit(event) {
    // Formun varsayılan sayfa yenileme davranışını engeller.
    event.preventDefault()

    // Form verilerini temizleyerek Dashboard bileşenine hazırlar.
    const taskData = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      priority: formData.priority,
      status: formData.status,
      assignee: formData.assignee.trim(),
      dueDate: formData.dueDate || null
    }

    // Zorunlu alanlar boşsa görev gönderilmez.
    if (!taskData.title || !taskData.assignee) {
      return
    }

    
    // Son teslim tarihinin geçerli formatta ve belirlenen aralıkta
    // olup olmadığını kontrol eder.
    if (taskData.dueDate) {
    const datePattern = /^\d{4}-\d{2}-\d{2}$/

    // Yılın 4 haneli olmasını ve tarih biçimini doğrular.
    if (!datePattern.test(taskData.dueDate)) {
        alert('Please enter a valid date with a 4-digit year.')
        return
    }

    // Geçmiş tarihlerin kullanılmasını engeller.
    if (taskData.dueDate < getTodayDate()) {
        alert('Due date cannot be earlier than today.')
        return
    }

    // Belirlenen 5 yıllık sınırın aşılmasını engeller.
    if (taskData.dueDate > getMaxDueDate()) {
        alert('Due date cannot be more than 5 years from today.')
        return
    }
    }

    // Görev verilerini Dashboard bileşenine iletir.
    // Verinin kaydedilmesi burada gerçekleştirilmez.
    onSubmit(taskData)
  }

  return (
    <form onSubmit={handleSubmit} className="card shadow-sm">
      <div className="card-body">
        
        {/* Formun başlığı işlem türüne göre değişir. */}
        <h3 className="h5 mb-4">
          {isEditing ? 'Edit Task' : 'Create New Task'}
        </h3>

        {/* Görev başlığı */}
        <div className="mb-3">
          <label htmlFor="taskTitle" className="form-label">
            Task Title *
          </label>
          <input
            id="taskTitle"
            name="title"
            type="text"
            className="form-control"
            value={formData.title}
            onChange={handleChange}
            required
            maxLength={100}
          />
        </div>

        {/* Görev açıklaması */}
        <div className="mb-3">
          <label htmlFor="taskDescription" className="form-label">
            Description
          </label>
          <textarea
            id="taskDescription"
            name="description"
            className="form-control"
            rows="3"
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        {/* Görevin öncelik seviyesi */}
        <div className="mb-3">
          <label htmlFor="taskPriority" className="form-label">
            Priority
          </label>
          <select
            id="taskPriority"
            name="priority"
            className="form-select"
            value={formData.priority}
            onChange={handleChange}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        {/* Görevin mevcut durumunu belirler. */}
        <div className="mb-3">
          <label htmlFor="taskStatus" className="form-label">
            Status
          </label>
          <select
            id="taskStatus"
            name="status"
            className="form-select"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {/* Görevden sorumlu kişi */}
        <div className="mb-3">
          <label htmlFor="taskAssignee" className="form-label">
            Assignee *
          </label>
          <input
            id="taskAssignee"
            name="assignee"
            type="text"
            className="form-control"
            value={formData.assignee}
            onChange={handleChange}
            required
          />
        </div>

        {/* İsteğe bağlı son teslim tarihi */}
        <div className="mb-4">
          <label htmlFor="taskDueDate" className="form-label">
            Due Date
          </label>
          <input
            id="taskDueDate"
            name="dueDate"
            type="date"
            className="form-control"
            value={formData.dueDate}
            onChange={handleChange}
            min={getTodayDate()}
            max={getMaxDueDate()}
          />
        </div>

        {/* Form işlemleri: iptal etme ve kaydetme */}
        <div className="d-flex justify-content-end gap-2">
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={onCancel}
          >
            Cancel
          </button>

          {/* Ekleme ve düzenleme işlemleri için uygun buton metnini gösterir. */}
          <button type="submit" className="btn btn-primary">
            {isEditing ? 'Update Task' : 'Save Task'}
          </button>
        </div>
        
      </div>
    </form>
  )
}

export default TaskForm
