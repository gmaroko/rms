### Landmark Template
```html
<header>
  <nav aria-label="Main navigation">
    <ul>
      <li><a href="index.html">Home</a></li>
      <li><a href="views/data.html">Rooms</a></li>
      <li><a href="views/form.html">Book a Room</a></li>
    </ul>
  </nav>
</header>
<main id="main" tabindex="-1">
  <h1>Page Title</h1>
</main>
<footer>
  <p>&copy; 2025 Project Alpha</p>
</footer>

```
---
### Skip Link Example
```html
<a href="#main" class="skip-link">Skip to main content</a>
```
---
### Form Group with <label for> + Helper Text
```html
<div class="form-group">
  <label for="name">Name:</label>
  <input type="text" id="name" name="name" required>
  <small>Enter your full name</small>
</div>
```

---
###  Example ARIA Usage
```html
<li><a href="views/data.html" aria-current="page">Rooms</a></li>
```

---
### Keyboard-Operable Component (Disclosure Button)

```html

<button aria-expanded="false" aria-controls="filter-panel" id="toggle-filters">
  Show Filters
</button>
<div id="filter-panel" hidden>
</div>
```
```js

<script>
  const toggleBtn = document.getElementById('toggle-filters');
  const panel = document.getElementById('filter-panel');

  toggleBtn.addEventListener('click', () => {
    const expanded = toggleBtn.getAttribute('aria-expanded') === 'true';
    toggleBtn.setAttribute('aria-expanded', !expanded);
    panel.hidden = expanded;
  });
</script>

```
---