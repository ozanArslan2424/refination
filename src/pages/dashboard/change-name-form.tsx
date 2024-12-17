import { db } from "@/lib/db";
import { ProfileData } from "@/lib/schemas";
import { useState, FormEvent } from "react";
import { toast } from "sonner";

export function ChangeNameForm({ profileData }: { profileData: ProfileData }) {
  const [name, setName] = useState(profileData.user.name);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newName = formData.get("name") as string;

    try {
      await db.update("users", profileData.user.id, { name: newName });
    } catch (error) {
      console.error(error);
      toast.error("Failed to change name");
    } finally {
      setName(newName);
    }
  }

  return (
    <div>
      <h3>You can change your name here.</h3>
      <p className="pb-4 font-medium text-muted-foreground">Current name: {name}</p>
      <form onSubmit={handleSubmit}>
        <fieldset>
          <label htmlFor="name">New Name</label>
          <input type="text" id="name" name="name" />
        </fieldset>

        <button type="submit">Change Name</button>
      </form>
    </div>
  );
}
