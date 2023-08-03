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
      <Logo />
      <Form onItemAdd={handleAddItem} />
      <PackingList
        items={items}
        onItemDelete={handleDeleteItem}
        onItemToggle={handleToggleItem}
        onReset={handleReset}
      />
      <Stats items={items} />
    </div>
  );
}

function Logo() {
  return <h1>🎄 Far Away 💼</h1>;
}

function Form({ onItemAdd }) {
  const [quantity, setQuantity] = useState(1);
  const [description, setDesciption] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    if (!description) return;
    const newItem = {
      id: crypto.randomUUID(),
      quantity,
      description,
      packed: false,
    };

    onItemAdd(newItem);

    setDesciption("");
    setQuantity(1);
  }

  return (
    <form className="add-form" onSubmit={handleSubmit}>
      <h3>What do you need for your 😍 trip?</h3>
      <select
        value={quantity}
        onChange={(e) => setQuantity(Number(e.target.value))}
      >
        {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
          <option value={num} key={num}>
            {num}
          </option>
        ))}
      </select>
      <input
        type="text"
        placeholder="Item..."
        value={description}
        onChange={(e) => setDesciption(e.target.value)}
      />
      <button>Add</button>
    </form>
  );
}

function PackingList({ items, onItemDelete, onItemToggle, onReset }) {
  const [sortBy, setSortBy] = useState("packed");

  let sortedItems;

  if (sortBy === "input") sortedItems = items;

  if (sortBy === "description")
    sortedItems = items
      .slice()
      .sort((a, b) => a.description.localeCompare(b.description));

  if (sortBy === "packed")
    sortedItems = items
      .slice()
      .sort((a, b) => Number(a.packed) - Number(b.packed));

  return (
    <div className="list">
      <ul>
        {sortedItems.map((item) => (
          <Item
            key={item.id}
            item={item}
            onItemDelete={onItemDelete}
            onItemToggle={onItemToggle}
          />
        ))}
      </ul>
      <div className="actions">
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="input">SORT BY INPUT ORDER</option>
          <option value="description">SORT BY DESCRIPTION</option>
          <option value="packed">SORT BY PACKED STATUS</option>
        </select>
        <button onClick={onReset}>Clear List</button>
      </div>
    </div>
  );
}

function Item({ item, onItemDelete, onItemToggle }) {
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
      <button onClick={() => onItemDelete(item.id)}>❌</button>
    </li>
  );
}

function Stats({ items }) {
  if (!items.length) {
    return (
      <p className="stats">
        <em>Start adding some items to your list✈</em>
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
          ? "You got everythig ! Ready to go✈"
          : ` You have ${numItems} items on the list, and you have already packed
        ${numPacked} (${percentage})`}
      </em>
    </footer>
  );
}
