import React, { useState } from "react";

const BookingForm = ({ isOpen, inClose, onSave }) => {
    const [formData, setFormData] = useState({
        companyName: "",
        companyEmail: "",
        contactNumber: "",
        businessType: "",
        webURL: "",
        location: "",
        reference: "",
    
        billingEmail: "",
        gstNumber: "",
    
        spocName: "",
        spocEmail: "",
    
        kycDoc: "",
      }); 
}