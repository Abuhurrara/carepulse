"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import SubmitButton from "../SubmitButton";
import { useState } from "react";

import { useRouter } from "next/navigation";
import { createUser } from "@/lib/actions/patient.actions";
import CustomFormField from "../CustomFormField";
import { UserFormValidation } from "@/lib/validation";

export enum FormFieldType {
  INPUT = "input",
  TEXTAREA = "textarea",
  PHONE_INPUT = "phoneinput",
  CHECKBOX = "checkbox",
  DATE_PICKER = "datePicker",
  SELECT = "select",
  SEKELTON = "sekelton",
}

const PatientForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof UserFormValidation>>({
    resolver: zodResolver(UserFormValidation),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  });

  async function onSubmit({
    name,
    email,
    phone,
  }: z.infer<typeof UserFormValidation>) {
    setIsLoading(true);

    try {
      const userData = { name, email, phone };
      const user = await createUser(userData);

      if (user) router.push(`/patients/${user.$id}/register`);
    } catch (error) {
      console.log(error);
    }

    setIsLoading(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
        <section className="mb-12 space-y-4">
          <h1 className="header ">Hi there 👋</h1>
          <p className="text-dark-700">Schedule your first appointment.</p>
        </section>
        <CustomFormField
          control={form.control}
          fieldType={FormFieldType.INPUT}
          name="name"
          label="Full name"
          placeholder="Abu Hurrara"
          iconSrc="/assets/icons/user.svg"
          iconAlt="user"
        />
        <CustomFormField
          control={form.control}
          fieldType={FormFieldType.INPUT}
          name="email"
          label="Email"
          placeholder="abuhurrara@gmail.com"
          iconSrc="/assets/icons/email.svg"
          iconAlt="email"
        />
        <CustomFormField
          control={form.control}
          fieldType={FormFieldType.PHONE_INPUT}
          name="phone"
          label="Phone number"
          placeholder="(521) 123-4567"
        />
        <SubmitButton isLoading={isLoading}>Get Started</SubmitButton>
      </form>
    </Form>
  );
};

export default PatientForm;
