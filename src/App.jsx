import { useState } from "react";

export default function App() {
  const [items, setItems] = useState([]);

  function handleAddItem(item) {
    setItems((items) => [...items, item]);
  }

  function handleDeleteItem(id) {
    setItems((items) => items.filter((item) => item.id !== id));
  }

  function handleToggleItem(id) {
    setItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, packed: !item.packed } : item
      )
    );
  }

  function handleReset() {
    const confirmed = window.confirm(
      "Are you sure you want to delete all the items?"
    );
    if (confirmed) setItems([]);
  }
  return (
    <div className="app">
      <Header />
      <Form onAddItem={handleAddItem} />
      <ItemList
        items={items}
        onDeleteItem={handleDeleteItem}
        onReset={handleReset}
        onItemToggle={handleToggleItem}
      />
      <Stats items={items} />
    </div>
  );
}

function Header() {
  return <h1>🌲 Far from Home 💼</h1>;
}

function Form({ onAddItem }) {
  const [quantity, setQuantity] = useState(1);
  const [description, setDescription] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    if (!description) return;

    const newItem = {
      id: crypto.randomUUID(),
      quantity,
      description,
      packed: false,
    };

    onAddItem(newItem);
    setQuantity(1);
    setDescription("");
  }
  return (
    <form className="add-form" onClick={handleSubmit}>
      <h3>What do you need for your trip😍?</h3>
      <select value={quantity} onChange={(e) => setQuantity(e.target.value)}>
        {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
          <option value={num} key={num}>
            {num}
          </option>
        ))}
      </select>
      <input
        value={description}
        type="text"
        placeholder="Item..."
        onChange={(e) => setDescription(e.target.value)}
      />
      <button>Add</button>
    </form>
  );
}

function ItemList({ items, onDeleteItem, onReset, onItemToggle }) {
  const [soryBy, setSortBy] = useState("packed");

  let sortedItems;

  if (soryBy === "input") sortedItems = items;

  if (soryBy === "description") {
    sortedItems = items
      .slice()
      .sort((a, b) => a.description.localeCompare(b.description));
  }

  if (soryBy === "packed") {
    sortedItems = items
      .slice()
      .sort((a, b) => Number(a.packed) - Number(b.packed));
  }

  return (
    <div className="list">
      <ul>
        {sortedItems.map((item) => (
          <Item
            item={item}
            key={item.id}
            onDeleteItem={onDeleteItem}
            onItemToggle={onItemToggle}
          />
        ))}
      </ul>
      <div className="actions">
        <select value={soryBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="input">SORT BY INPUT ORDER</option>
          <option value="description">SORT BY DESCRIPTION</option>
          <option value="packed">SORT BY PACKED STATUS</option>
        </select>
        <button onClick={onReset}>Clear list</button>
      </div>
    </div>
  );
}

function Item({ item, onDeleteItem, onItemToggle }) {
  return (
    <li>
      <input
        type="checkbox"
        checked={item.packed}
        onChange={() => onItemToggle(item.id)}
      />
      <span style={item.packed ? { textDecoration: "line-through" } : {}}>
        {item.quantity} {item.description}
      </span>
      <button onClick={() => onDeleteItem(item.id)}>❌</button>
    </li>
  );
}

function Stats({ items }) {
  if (!items.length) {
    return (
      <p className="stats">
        <em>Start adding some items to your lists</em>
      </p>
    );
  }

  const numItems = items.length;
  const numPacked = items.filter((item) => item.packed === true).length;
  const percentage = Math.round((numPacked / numItems) * 100) || 0;

  return (
    <footer className="stats">
      <em>
        {percentage === 100
          ? "you got everything! Ready to  go ✈"
          : `You have ${numItems} items on the list, and you have already packed ${numPacked} (${percentage})`}
      </em>
    </footer>
  );
}
