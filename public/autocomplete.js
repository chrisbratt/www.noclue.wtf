let suggestions = [];

export async function setupAutocomplete() {
  const input = document.getElementById("movie-guess");
  const list = document.getElementById("autocomplete-list");

  if (!input || !list) {
    console.error("Missing autocomplete elements");
    return;
  }

  try {
    const res = await fetch("/.netlify/functions/get-suggestions");
    suggestions = await res.json();
  } catch (err) {
    console.error("Failed to load suggestions:", err);
    return;
  }

  input.addEventListener("input", () => {
    const value = input.value.toLowerCase();
    list.innerHTML = "";

    if (!value) {
      list.style.display = 'none';
      return;
    }

    const matches = suggestions
      .filter(title => title.toLowerCase().includes(value))
      .slice(0, 10); // Limit to top 10 matches

    matches.forEach(match => {
      const li = document.createElement("li");
      li.textContent = match;
      li.addEventListener("click", () => {
        input.value = match;
        list.innerHTML = "";
        list.style.display = 'none';
      });
      list.appendChild(li);
    });

    list.style.display = matches.length ? 'block' : 'none';
  });

  input.addEventListener("blur", () => {
    setTimeout(() => {
      list.innerHTML = "";
      list.style.display = 'none';
    }, 150);
  });
}
