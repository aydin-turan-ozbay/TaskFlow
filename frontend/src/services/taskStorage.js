const STORAGE_KEY = 'taskflow_tasks'

// LocalStorage'dan kayıtlı görevleri güvenli şekilde okur.
export function getTasks() {
  try {
    const storedTasks = localStorage.getItem(STORAGE_KEY)

    // Henüz kayıt yoksa boş görev listesi döndürür.
    if (storedTasks === null) {
      return {
        success: true,
        tasks: []
      }
    }

    // JSON biçimindeki kayıtlı veriyi JavaScript nesnesine dönüştürür.
    const tasks = JSON.parse(storedTasks)

    // Verinin beklenen dizi yapısında olduğunu doğrular.
    if (!Array.isArray(tasks)) {
      throw new Error('Stored task data is not an array.')
    }

    return {
      success: true,
      tasks
    }
  } catch (error) {
    // Okuma veya veri biçimi hatalarını tarayıcı konsoluna yazar.
    console.error('Error loading tasks:', error)

    // Hata durumunu boş görev listesinden ayrı olarak bildirir.
    return {
      success: false,
      tasks: null
    }
  }
}

// Görev listesini LocalStorage'a kaydeder.
export function saveTasks(tasks) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
    return true
  } catch (error) {
    // Kaydetme hatalarını tarayıcı konsoluna yazar.
    console.error('Error saving tasks:', error)
    return false
  }
}
