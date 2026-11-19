import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query"
import { Link } from "@tanstack/react-router"
import { Suspense } from "react"

import { type TaskPublic, TasksService } from "@/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Skeleton } from "@/components/ui/skeleton"
import useCustomToast from "@/hooks/useCustomToast"
import { cn } from "@/lib/utils"
import { handleError } from "@/utils"

function getTasksQueryOptions() {
  return {
    queryFn: async () =>
      (await TasksService.readTasks({ query: { skip: 0, limit: 100 } })).data,
    queryKey: ["tasks"],
  }
}

function isDueTodayOrOverdue(task: TaskPublic, todayIso: string) {
  return !task.is_completed && !!task.due_date && task.due_date <= todayIso
}

function TaskRow({ task }: { task: TaskPublic }) {
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

  const isOverdue = task.due_date! < new Date().toISOString().slice(0, 10)

  return (
    <div className="flex items-center gap-3">
      <Checkbox
        checked={task.is_completed}
        onCheckedChange={(checked) => mutation.mutate(checked === true)}
        aria-label={`Mark "${task.title}" as completed`}
      />
      <span className="flex-1 truncate">{task.title}</span>
      {isOverdue && <span className="text-xs text-destructive">Overdue</span>}
    </div>
  )
}

function TodayTasksContent() {
  const { data: tasks } = useSuspenseQuery(getTasksQueryOptions())
  const todayIso = new Date().toISOString().slice(0, 10)
  const dueTasks = tasks.data.filter((task) =>
    isDueTodayOrOverdue(task, todayIso),
  )

  if (dueTasks.length === 0) {
    return (
      <p className="text-muted-foreground text-sm">Nothing due today. 🎉</p>
    )
  }

  return (
    <div className={cn("flex flex-col gap-3")}>
      {dueTasks.map((task) => (
        <TaskRow key={task.id} task={task} />
      ))}
    </div>
  )
}

function TodayTasksFallback() {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="flex items-center gap-3">
          <Skeleton className="size-4" />
          <Skeleton className="h-4 flex-1" />
        </div>
      ))}
    </div>
  )
}

export function TodayTasks() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Link to="/tasks">Tasks due today</Link>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Suspense fallback={<TodayTasksFallback />}>
          <TodayTasksContent />
        </Suspense>
      </CardContent>
    </Card>
  )
}
