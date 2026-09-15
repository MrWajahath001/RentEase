import React from "react";

export function Footer() {
  return (
    <div>
      <footer className="bg-dark text-white text-center py-4">
        &copy; {new Date().getFullYear()} RentEase. All rights reserved.
      </footer>
    </div>
  );
}


