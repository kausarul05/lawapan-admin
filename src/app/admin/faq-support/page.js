// app/admin/faq/page.js
"use client";

import FAQForm from "@/components/FAQManagement/FAQForm";
import FAQManagement from "@/components/FAQManagement/FAQManagement";
import React, { useState } from "react";

export default function FAQPage() {
  // State to track which screen to show
  const [view, setView] = useState("list"); // Options: "list", "add", "edit"
  
  // State to hold the data of the FAQ being edited
  const [selectedFaq, setSelectedFaq] = useState(null);

  // Function to handle moving to the Edit screen
  const handleEditInitiation = (faq) => {
    setSelectedFaq(faq);
    setView("edit");
  };

  // Function to handle successful operation
  const handleSuccess = () => {
    setView("list");
    setSelectedFaq(null);
  };

  // VIEW: ADD FAQ
  if (view === "add") {
    return (
      <FAQForm
        mode="add" 
        onBack={() => setView("list")}
        onSuccess={handleSuccess}
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
          setSelectedFaq(null);
        }}
        onSuccess={handleSuccess}
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