import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { ColumnDef } from "@tanstack/react-table"

import { type TaskPublic, TasksService } from "@/client"
import type { DataTableFeatures } from "@/components/Common/DataTable"
import { Checkbox } from "@/components/ui/checkbox"
import useCustomToast from "@/hooks/useCustomToast"
import { cn } from "@/lib/utils"
import { handleError } from "@/utils"
import { TaskActionsMenu } from "./TaskActionsMenu"

function CompleteCheckbox({ task }: { task: TaskPublic }) {
  const queryClient = useQueryClient()
  const { showErrorToast } = useCustomToast()

  const mutation = useMutation({
    mutationFn: (is_completed: boolean) =>
      TasksService.updateTask({
        path: { id: task.id },
        body: { is_completed },
      }),
    onError: handleError.bind(showErrorToast),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] })
    },
  })

  return (
    <Checkbox
      checked={task.is_completed}
      onCheckedChange={(checked) => mutation.mutate(checked === true)}
      aria-label={`Mark "${task.title}" as completed`}
    />
  )
}

function formatDueDate(dueDate: string | null | undefined) {
  if (!dueDate) return null
  return new Date(`${dueDate}T00:00:00`).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

export const columns: ColumnDef<DataTableFeatures, TaskPublic>[] = [
  {
    id: "is_completed",
    header: () => <span className="sr-only">Completed</span>,
    cell: ({ row }) => <CompleteCheckbox task={row.original} />,
  },
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => (
      <span
        className={cn(
          "font-medium",
          row.original.is_completed && "line-through text-muted-foreground",
        )}
      >
        {row.original.title}
      </span>
    ),
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => {
      const description = row.original.description
      return (
        <span
          className={cn(
            "max-w-xs truncate block text-muted-foreground",
            !description && "italic",
          )}
        >
          {description || "No description"}
        </span>
      )
    },
  },
  {
    accessorKey: "due_date",
    header: "Due date",
    cell: ({ row }) => {
      const formatted = formatDueDate(row.original.due_date)
      return (
        <span className={cn("text-muted-foreground", !formatted && "italic")}>
          {formatted || "No due date"}
        </span>
      )
    },
  },
  {
    id: "actions",
    header: () => <span className="sr-only">Actions</span>,
    cell: ({ row }) => (
      <div className="flex justify-end">
        <TaskActionsMenu task={row.original} />
      </div>
    ),
  },
]
