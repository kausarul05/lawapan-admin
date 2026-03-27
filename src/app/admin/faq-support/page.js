// app/admin/faq/page.js
"use client";

import FAQForm from "@/components/FAQManagement/FAQForm";
import FAQManagement from "@/components/FAQManagement/FAQManagement";
import React, { useState } from "react";


export default function FAQPage() {
  // 1. State to track which screen to show
  const [view, setView] = useState("list"); // Options: "list", "add", "edit"
  
  // 2. State to hold the data of the FAQ being edited
  const [selectedFaq, setSelectedFaq] = useState(null);

  // Function to handle moving to the Edit screen
  const handleEditInitiation = (faq) => {
    setSelectedFaq(faq);
    setView("edit");
  };

  // 3. Conditional Rendering based on state
  
  // VIEW: ADD FAQ
  if (view === "add") {
    return (
      <FAQForm
        mode="add" 
        onBack={() => setView("list")} 
      />
    );
  }

  // VIEW: EDIT FAQ
  if (view === "edit") {
    return (
      <FAQForm 
        mode="edit" 
        initialData={selectedFaq} 
        onBack={() => {
          setView("list");
          setSelectedFaq(null); // Clear selection on back
        }} 
      />
    );
  }

  // VIEW: LIST (Default)
  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <FAQManagement
        onAddClick={() => setView("add")} 
        onEditClick={handleEditInitiation} 
      />
    </div>
  );
}
