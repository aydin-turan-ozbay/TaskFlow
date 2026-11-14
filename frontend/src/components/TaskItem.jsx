function TaskItem({ task, onDelete, onEdit }) {
  // Öncelik seviyesine göre Bootstrap rozet rengini belirler.
  function getPriorityClass(priority) {
    switch (priority) {
      case 'high':
        return 'text-bg-danger'
      case 'medium':
        return 'text-bg-warning'
      case 'low':
        return 'text-bg-success'
      default:
        return 'text-bg-secondary'
    }
  }

  // Görevin durumunu kullanıcıya okunabilir şekilde gösterir.
  function getStatusLabel(status) {
    switch (status) {
      case 'todo':
        return 'To Do'
      case 'in-progress':
        return 'In Progress'
      case 'completed':
        return 'Completed'
      default:
        return 'Unknown'
    }
  }

  // Düzenlenmek istenen görevi üst bileşene iletir.
  function handleEdit() {
    onEdit(task)
  }

  // Kullanıcının silme isteğini üst bileşene iletir.
  function handleDelete() {
    const isConfirmed = window.confirm(
      'Are you sure you want to delete this task?'
    )

    // Kullanıcı işlemi onaylarsa görevin kimliğini iletir.
    if (isConfirmed) {
      onDelete(task.id)
    }
  }


  return (
    <div className="card shadow-sm mb-3">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start gap-3">
          <div>
            <h3 className="h5 card-title mb-2">
              {task.title}
            </h3>

            <span
              className={`badge ${getPriorityClass(task.priority)}`}
            >
              {task.priority}
            </span>
          </div>

          {/* Görevin mevcut durumunu gösterir. */}
          <span className="badge text-bg-secondary">
            {getStatusLabel(task.status)}
          </span>
        </div>

        {/* Açıklama yalnızca mevcutsa görüntülenir. */}
        {task.description && (
          <p className="card-text text-muted mt-3 mb-2">
            {task.description}
          </p>
        )}

        <div className="mt-3 small text-muted">
          <p className="mb-1">
            <strong>Assignee:</strong> {task.assignee}
          </p>

          <p className="mb-0">
            <strong>Due Date:</strong> {task.dueDate || 'Not specified'}
          </p>
        </div>
        
        {/* Görev düzenleme ve silme işlemlerini başlatan butonlar. */}
        <div className="d-flex justify-content-end gap-2 mt-3">
        <button
            type="button"
            className="btn btn-outline-primary btn-sm"
            onClick={handleEdit}
        >
            Edit
        </button>

        <button
            type="button"
            className="btn btn-outline-danger btn-sm"
            onClick={handleDelete}
        >
            Delete
        </button>
        </div>

      </div>
    </div>
  )
}

export default TaskItem
