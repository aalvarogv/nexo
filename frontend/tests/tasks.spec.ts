import { expect, test } from "@playwright/test"
import { createUser } from "./utils/privateApi"
import {
  randomEmail,
  randomPassword,
  randomTaskDescription,
  randomTaskTitle,
} from "./utils/random"
import { logInUser } from "./utils/user"

test("Tasks page is accessible and shows correct title", async ({ page }) => {
  await page.goto("/tasks")
  await expect(page.getByRole("heading", { name: "Tasks" })).toBeVisible()
  await expect(page.getByText("Create and manage your tasks")).toBeVisible()
})

test("Add Task button is visible", async ({ page }) => {
  await page.goto("/tasks")
  await expect(page.getByRole("button", { name: "Add Task" })).toBeVisible()
})

test.describe("Tasks management", () => {
  test.use({ storageState: { cookies: [], origins: [] } })
  let email: string
  const password = randomPassword()

  test.beforeAll(async () => {
    email = randomEmail()
    await createUser({ email, password })
  })

  test.beforeEach(async ({ page }) => {
    await logInUser(page, email, password)
    await page.goto("/tasks")
  })

  test("Create a new task successfully", async ({ page }) => {
    const title = randomTaskTitle()
    const description = randomTaskDescription()

    await page.getByRole("button", { name: "Add Task" }).click()
    await page.getByLabel("Title").fill(title)
    await page.getByLabel("Description").fill(description)
    await page.getByRole("button", { name: "Save" }).click()

    await expect(page.getByText("Task created successfully")).toBeVisible()
    await expect(page.getByText(title)).toBeVisible()
  })

  test("Create task with only required fields", async ({ page }) => {
    const title = randomTaskTitle()

    await page.getByRole("button", { name: "Add Task" }).click()
    await page.getByLabel("Title").fill(title)
    await page.getByRole("button", { name: "Save" }).click()

    await expect(page.getByText("Task created successfully")).toBeVisible()
    await expect(page.getByText(title)).toBeVisible()
  })

  test("Cancel task creation", async ({ page }) => {
    await page.getByRole("button", { name: "Add Task" }).click()
    await page.getByLabel("Title").fill("Test Task")
    await page.getByRole("button", { name: "Cancel" }).click()

    await expect(page.getByRole("dialog")).not.toBeVisible()
  })

  test("Title is required", async ({ page }) => {
    await page.getByRole("button", { name: "Add Task" }).click()
    await page.getByLabel("Title").fill("")
    await page.getByLabel("Title").blur()

    await expect(page.getByText("Title is required")).toBeVisible()
  })

  test.describe("Edit, complete and delete", () => {
    let taskTitle: string

    test.beforeEach(async ({ page }) => {
      taskTitle = randomTaskTitle()

      await page.getByRole("button", { name: "Add Task" }).click()
      await page.getByLabel("Title").fill(taskTitle)
      await page.getByRole("button", { name: "Save" }).click()
      await expect(page.getByText("Task created successfully")).toBeVisible()
      await expect(page.getByRole("dialog")).not.toBeVisible()
    })

    test("Edit a task successfully", async ({ page }) => {
      const taskRow = page.getByRole("row").filter({ hasText: taskTitle })
      await taskRow.getByRole("button").last().click()
      await page.getByRole("menuitem", { name: "Edit Task" }).click()

      const updatedTitle = randomTaskTitle()
      await page.getByLabel("Title").fill(updatedTitle)
      await page.getByRole("button", { name: "Save" }).click()

      await expect(page.getByText("Task updated successfully")).toBeVisible()
      await expect(page.getByText(updatedTitle)).toBeVisible()
    })

    test("Mark a task as completed", async ({ page }) => {
      const taskRow = page.getByRole("row").filter({ hasText: taskTitle })
      await taskRow.getByRole("checkbox").click()

      await expect(taskRow.getByRole("checkbox")).toHaveAttribute(
        "data-state",
        "checked",
      )
      await expect(taskRow.getByText(taskTitle, { exact: true })).toHaveClass(
        /line-through/,
      )
    })

    test("Delete a task successfully", async ({ page }) => {
      const taskRow = page.getByRole("row").filter({ hasText: taskTitle })
      await taskRow.getByRole("button").last().click()
      await page.getByRole("menuitem", { name: "Delete Task" }).click()

      await page.getByRole("button", { name: "Delete" }).click()

      await expect(
        page.getByText("The task was deleted successfully"),
      ).toBeVisible()
      await expect(page.getByText(taskTitle)).not.toBeVisible()
    })
  })
})

test.describe("Tasks empty state", () => {
  test.use({ storageState: { cookies: [], origins: [] } })

  test("Shows empty state message when no tasks exist", async ({ page }) => {
    const email = randomEmail()
    const password = randomPassword()
    await createUser({ email, password })
    await logInUser(page, email, password)

    await page.goto("/tasks")

    await expect(page.getByText("You don't have any tasks yet")).toBeVisible()
    await expect(page.getByText("Add a new task to get started")).toBeVisible()
  })
})
