import React from "react";

const Header = () => (
  <div className="header">
    <h2>Space Management</h2>
    <div className="button-group">
      <button className="btn-primary">Manage Locations</button>
      <button>Inventory</button>
      <button>Plans</button>
    </div>
  </div>
);

export default Header