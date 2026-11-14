import TaskItem from './TaskItem'

// Görev listesini, düzenleme ve silme işlemlerini alt bileşenlere aktarır.
function TaskList({ tasks, onDelete, onEdit }) {
    
  // Görev listesi boşsa kullanıcıya bilgilendirme mesajı gösterir.
  if (tasks.length === 0) {
    return (
      <div className="text-center py-5">
        <h3 className="h5 text-muted">No tasks found</h3>
        <p className="text-muted mb-0">
          You haven't created any tasks yet.
        </p>
      </div>
    )
  }

  return (
    <div className="row">

      {/* Her görev için ayrı bir TaskItem bileşeni oluşturur. */}
      {tasks.map((task) => (
        <div className="col-12 col-md-6 col-lg-4 mb-3" key={task.id}>
          
          {/* Görev bilgilerini, güncelleme ve silme  fonksiyonlarını ilgili karta iletir. */}
          <TaskItem 
          task={task}
          onDelete={onDelete}
          onEdit={onEdit} />

        </div>
      ))}
    </div>
  )
}

export default TaskList
