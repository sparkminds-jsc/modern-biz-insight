import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Trash2 } from "lucide-react";
import { CustomerContact } from "@/types/customerContact";

interface ContactListProps {
  contacts: Partial<CustomerContact>[];
  onContactsChange: (contacts: Partial<CustomerContact>[]) => void;
}

export function ContactList({ contacts, onContactsChange }: ContactListProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const addContact = () => {
    const newContact: Partial<CustomerContact> = {
      name: "",
      position: "",
      contact_info: "",
      last_contact_date: "",
      notes: "",
    };
    onContactsChange([...contacts, newContact]);
    setEditingIndex(contacts.length);
  };

  const updateContact = (index: number, field: keyof CustomerContact, value: string) => {
    const updated = [...contacts];
    updated[index] = { ...updated[index], [field]: value };
    onContactsChange(updated);
  };

  const removeContact = (index: number) => {
    const updated = contacts.filter((_, i) => i !== index);
    onContactsChange(updated);
    if (editingIndex === index) {
      setEditingIndex(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Label className="text-base font-semibold">Danh sách liên hệ</Label>
        <Button type="button" onClick={addContact} variant="outline" size="sm">
          Thêm liên hệ
        </Button>
      </div>

      {contacts.map((contact, index) => (
        <div key={index} className="border rounded-lg p-4 space-y-3">
          <div className="flex justify-between items-start">
            <h4 className="font-medium">Liên hệ {index + 1}</h4>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => removeContact(index)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor={`contact-name-${index}`}>Tên</Label>
              <Input
                id={`contact-name-${index}`}
                value={contact.name || ""}
                onChange={(e) => updateContact(index, "name", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor={`contact-position-${index}`}>Chức vụ</Label>
              <Input
                id={`contact-position-${index}`}
                value={contact.position || ""}
                onChange={(e) => updateContact(index, "position", e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label htmlFor={`contact-info-${index}`}>Thông tin liên hệ</Label>
            <Textarea
              id={`contact-info-${index}`}
              value={contact.contact_info || ""}
              onChange={(e) => updateContact(index, "contact_info", e.target.value)}
              rows={2}
            />
          </div>

          <div>
            <Label htmlFor={`contact-date-${index}`}>Lần liên hệ cuối</Label>
            <Input
              id={`contact-date-${index}`}
              type="datetime-local"
              value={contact.last_contact_date || ""}
              onChange={(e) => updateContact(index, "last_contact_date", e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor={`contact-notes-${index}`}>Ghi chú</Label>
            <Textarea
              id={`contact-notes-${index}`}
              value={contact.notes || ""}
              onChange={(e) => updateContact(index, "notes", e.target.value)}
              rows={2}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
