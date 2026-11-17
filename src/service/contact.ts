export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

export const validateContactForm = (data: ContactFormData): { isValid: boolean; errorMessage?: string } => {
  if (!data.name.trim()) {
    return { 
      isValid: false, 
      errorMessage: "กรุณากรอกชื่อของคุณ (Name ไม่สามารถเว้นว่างได้)" 
    };
  }
  
  if (!data.email.trim()) {
    return { 
      isValid: false, 
      errorMessage: "กรุณากรอกอีเมลของคุณ (Email ไม่สามารถเว้นว่างได้)" 
    };
  }

  // ตรวจสอบรูปแบบอีเมล (Email Format)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    return { 
      isValid: false, 
      errorMessage: "รูปแบบอีเมลไม่ถูกต้อง (ตัวอย่าง: example@email.com)" 
    };
  }

  if (!data.message.trim() || data.message.length < 5) {
    return { 
      isValid: false, 
      errorMessage: "กรุณากรอกข้อความอย่างน้อย 5 ตัวอักษรขึ้นไป" 
    };
  }

  return { isValid: true };
};