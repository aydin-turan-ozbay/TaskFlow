function Header() {
  return (
    <header className="bg-white border-bottom shadow-sm">
      <div className="container py-3">
        <div className="d-flex align-items-center justify-content-between">
          <h1 className="h3 text-primary mb-0">
            TaskFlow
          </h1>

          <span className="text-muted small">
            Task Management Application
          </span>
        </div>
      </div>
    </header>
  )
}

export default Header