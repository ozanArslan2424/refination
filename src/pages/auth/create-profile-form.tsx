import { db } from "@/lib/db";
import type { DatabaseUser, Organization } from "@/lib/schemas";
import type { User } from "firebase/auth";
import { arrayUnion } from "firebase/firestore";
import type { FormEvent } from "react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { z } from "zod";

export function CreateProfileForm({ authUser }: { authUser: User }) {
  const [role, setRole] = useState<"manager" | "employee">("manager");

  const navigate = useNavigate();

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const formValues = Object.fromEntries(formData.entries());

    if (role === "manager") {
      const { data: managerData, error: managerError } = z
        .object({
          userName: z.string(),
          role: z.literal("manager"),
          orgName: z.string(),
        })
        .safeParse(formValues);

      if (managerError) {
        toast.error(managerError.message);
        return;
      }

      const orgId = crypto.randomUUID();

      const promise = Promise.all([
        db.set<Organization>("organizations", orgId, {
          id: orgId,
          name: managerData.orgName,
          managerId: authUser.uid,
          activeSessionId: "",
          sessionIds: [],
          userIds: [authUser.uid],
        }),
        db.set<DatabaseUser>("users", authUser.uid, {
          id: authUser.uid,
          name: managerData.userName,
          email: authUser.email ?? "",
          role: "manager",
          orgId,
        }),
      ]);

      await promise;

      toast.promise(promise, {
        loading: "Creating profile...",
        success: "Profile created successfully",
        error: (e) => {
          console.error(e);
          return "Failed to create profile";
        },
      });
    } else {
      const { data: employeeData, error: employeeError } = z
        .object({
          userName: z.string(),
          role: z.literal("employee"),
          orgId: z.string(),
        })
        .safeParse(formValues);

      if (employeeError) {
        toast.error(employeeError.message);
        return;
      }

      const org = await db.get<Organization>("organizations", employeeData.orgId);

      if (!org) {
        toast.error("Organization not found");
        return;
      }

      const promise = Promise.all([
        db.update<Partial<Organization>>("organizations", org.id, {
          userIds: arrayUnion(authUser.uid),
        }),
        db.set<DatabaseUser>("users", authUser.uid, {
          id: authUser.uid,
          name: employeeData.userName,
          email: authUser.email ?? "",
          role: "employee",
          orgId: org.id,
        }),
      ]);

      await promise;

      toast.promise(promise, {
        loading: "Creating profile...",
        success: "Profile created successfully",
        error: (e) => {
          console.error(e);
          return "Failed to create profile";
        },
      });
    }

    navigate("/dashboard", { replace: true });
  }

  return (
    <div className="flex flex-col gap-4 pt-4">
      <h2>Complete your profile to continue.</h2>

      <form onSubmit={handleSubmit}>
        <fieldset>
          <label htmlFor="userName">User Name</label>
          <input type="text" id="userName" name="userName" autoComplete="username" />
        </fieldset>

        <fieldset className="radio-group">
          <legend>I am a...</legend>
          <label>
            <input
              type="radio"
              name="role"
              value="manager"
              id="manager"
              onChange={() => setRole("manager")}
            />
            Manager
          </label>
          <label>
            <input
              type="radio"
              name="role"
              value="employee"
              id="employee"
              onChange={() => setRole("employee")}
            />
            Employee
          </label>
        </fieldset>

        {role === "manager" ? (
          <fieldset>
            <label htmlFor="orgName">Organization name</label>
            <input type="text" id="orgName" name="orgName" />
          </fieldset>
        ) : (
          <fieldset>
            <label htmlFor="orgId">
              <span>Organization ID</span>
              <span>Ask your manager about it</span>
            </label>
            <input type="text" id="orgId" name="orgId" />
          </fieldset>
        )}

        <button type="submit" className="primary w-full">
          Create Profile
        </button>
      </form>
    </div>
  );
}
