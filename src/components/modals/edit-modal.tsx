"use client";

// * * This is just a demostration of edit modal, actual functionality may vary

import { z } from "zod";
import {
  AlertType,
  alertStatuses,
} from "@/lib/validations/schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {  status_options } from "../filters";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";

type EditProps = {
  task: AlertType
};

const editSchema = z.object({
  id: z.string(),
  title: z.string().min(1, { message: "Title Required" }),
  status: z.enum(alertStatuses),
  due_date: z.date({
    required_error: "Due date is required.",
  }),
});

type editSchemaType = z.infer<typeof editSchema>;

export default function EditDialog({ task }: EditProps) {
  const form = useForm<editSchemaType>({
    resolver: zodResolver(editSchema),
    defaultValues: {
      id: task.id,
      title: task.title || "",
      status: task.status,
      due_date: task.createdAt,
    },
  });

  function onSubmit(values: editSchemaType) {
    console.log(values);
  }
  return (
    <>
      <DialogHeader>
        <DialogTitle>Edit Task Details</DialogTitle>
      </DialogHeader>
      <div className='py-4'>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='grid gap-4'>
            <FormField
              control={form.control}
              name='title'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input type='text' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='status'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Select a Status to Update' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        {status_options.map((status, index) => (
                          <SelectItem key={index} value={status.value}>
                            <span className='flex items-center'>
                              <status.icon className='mr-2 h-5 w-5 text-muted-foreground' />
                              {status.label}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
           
           
            <FormField
              control={form.control}
              name='due_date'
              render={({ field }) => (
                <FormItem className='flex flex-col'>
                  <FormLabel>Due Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                           <span>Pick a date</span>
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className='w-auto p-0' align='end'>
                      
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type='submit' className='mt-2 w-full'>
              Update Details
            </Button>
          </form>
        </Form>
      </div>
    </>
  );
}
