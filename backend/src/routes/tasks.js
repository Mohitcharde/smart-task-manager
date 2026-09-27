
// SMART TASK MANAGER - TASK ROUTES


const express = require("express");
const router = express.Router();

const {
    tasks,
    users,
    generateTaskId
} = require("../data/store");


// CONSTANTS


// Allowed task priorities.
const ALLOWED_PRIORITIES = ["Low", "Medium", "High"];

// Allowed task statuses.
const ALLOWED_STATUSES = ["To Do", "In Progress", "Done"];
// HELPER FUNCTIONS


// Check whether a user exists.
const userExists = (userId) => {
    return users.has(String(userId));
};

// Check whether a task exists.
const taskExists = (taskId) => {
    return tasks.has(String(taskId));
};

// Check whether all dependencies of a task are completed.
const areDependenciesCompleted = (task) => {
    return task.dependencies.every((dependencyId) => {
        const dependencyTask = tasks.get(String(dependencyId));

        // If a dependency does not exist,
        // consider it incomplete.
        if (!dependencyTask) {
            return false;
        }

        return dependencyTask.status === "Done";
    });
};

// Check if adding a dependency would create
// a circular dependency.
const createsCircularDependency = (
    taskId,
    dependencyId,
    visited = new Set()
) => {
    const dependencyTask = tasks.get(String(dependencyId));

    if (!dependencyTask) {
        return false;
    }

    // We reached the original task.
    if (String(dependencyId) === String(taskId)) {
        return true;
    }

    // Avoid checking the same task repeatedly.
    if (visited.has(String(dependencyId))) {
        return false;
    }

    visited.add(String(dependencyId));

    for (const nestedDependency of dependencyTask.dependencies) {
        if (
            createsCircularDependency(
                taskId,
                nestedDependency,
                visited
            )
        ) {
            return true;
        }
    }

    return false;
};


// POST /api/tasks
// CREATE TASK


router.post("/", (req, res) => {
    const {
        title,
        description,
        priority,
        status,
        assignedTo,
        dependencies
    } = req.body;

    // Basic validation.
    if (!title || !title.trim()) {
        return res.status(400).json({
            success: false,
            message: "Task title is required"
        });
    }

    // Validate priority.
    if (priority && !ALLOWED_PRIORITIES.includes(priority)) {
        return res.status(400).json({
            success: false,
            message: "Priority must be Low, Medium or High"
        });
    }

    // Validate status.
    if (status && !ALLOWED_STATUSES.includes(status)) {
        return res.status(400).json({
            success: false,
            message: "Status must be To Do, In Progress or Done"
        });
    }

    // Validate assigned user.
    if (assignedTo && !userExists(assignedTo)) {
        return res.status(404).json({
            success: false,
            message: "Assigned user does not exist"
        });
    }

    // Convert dependencies into an array.
    const dependencyList = Array.isArray(dependencies)
        ? dependencies.map(String)
        : [];

    // Make sure all dependency tasks exist.
    for (const dependencyId of dependencyList) {
        if (!taskExists(dependencyId)) {
            return res.status(404).json({
                success: false,
                message: `Dependency task ${dependencyId} does not exist`
            });
        }
    }

    // Create task ID.
    const id = generateTaskId();

    const newTask = {
        id,
        title: title.trim(),
        description: description ? description.trim() : "",
        priority: priority || "Medium",
        status: status || "To Do",
        assignedTo: assignedTo ? String(assignedTo) : null,
        dependencies: dependencyList,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    // A new task cannot be marked Done
    // if its dependencies are incomplete.
    if (
        newTask.status === "Done" &&
        !areDependenciesCompleted(newTask)
    ) {
        return res.status(400).json({
            success: false,
            message: "Task cannot be marked Done because dependencies are incomplete"
        });
    }

    tasks.set(id, newTask);

    res.status(201).json({
        success: true,
        message: "Task created successfully",
        task: newTask
    });
});


// GET /api/tasks
// GET ALL TASKS

router.get("/", (req, res) => {
    const taskList = Array.from(tasks.values());

    res.json({
        success: true,
        count: taskList.length,
        tasks: taskList
    });
});


// GET /api/tasks/my/:userId
// GET TASKS ASSIGNED TO A USER

router.get("/my/:userId", (req, res) => {
    const userId = String(req.params.userId);

    if (!userExists(userId)) {
        return res.status(404).json({
            success: false,
            message: "User does not exist"
        });
    }

    const myTasks = Array.from(tasks.values()).filter(
        (task) => task.assignedTo === userId
    );

    res.json({
        success: true,
        count: myTasks.length,
        tasks: myTasks
    });
});


// GET /api/tasks/blocked
// GET BLOCKED TASKS


router.get("/blocked", (req, res) => {
    const blockedTasks = Array.from(tasks.values()).filter(
        (task) =>
            task.status !== "Done" &&
            task.dependencies.length > 0 &&
            !areDependenciesCompleted(task)
    );

    res.json({
        success: true,
        count: blockedTasks.length,
        tasks: blockedTasks
    });
});

// GET /api/tasks/:id
// GET SINGLE TASK


router.get("/:id", (req, res) => {
    const taskId = String(req.params.id);

    const task = tasks.get(taskId);

    if (!task) {
        return res.status(404).json({
            success: false,
            message: "Task not found"
        });
    }

    res.json({
        success: true,
        task
    });
});


// PUT /api/tasks/:id
// UPDATE TASK


router.put("/:id", (req, res) => {
    const taskId = String(req.params.id);

    const task = tasks.get(taskId);

    if (!task) {
        return res.status(404).json({
            success: false,
            message: "Task not found"
        });
    }

    const {
        title,
        description,
        priority,
        status,
        assignedTo,
        dependencies
    } = req.body;

    // Validate title if provided.
    if (title !== undefined && !title.trim()) {
        return res.status(400).json({
            success: false,
            message: "Task title cannot be empty"
        });
    }

    // Validate priority.
    if (
        priority !== undefined &&
        !ALLOWED_PRIORITIES.includes(priority)
    ) {
        return res.status(400).json({
            success: false,
            message: "Priority must be Low, Medium or High"
        });
    }

    // Validate status.
    if (
        status !== undefined &&
        !ALLOWED_STATUSES.includes(status)
    ) {
        return res.status(400).json({
            success: false,
            message: "Status must be To Do, In Progress or Done"
        });
    }

    // Validate assigned user.
    if (
        assignedTo !== undefined &&
        assignedTo !== null &&
        !userExists(assignedTo)
    ) {
        return res.status(404).json({
            success: false,
            message: "Assigned user does not exist"
        });
    }

    // Prepare dependencies.
    let newDependencies = task.dependencies;

    if (dependencies !== undefined) {
        if (!Array.isArray(dependencies)) {
            return res.status(400).json({
                success: false,
                message: "Dependencies must be an array"
            });
        }

        newDependencies = dependencies.map(String);

        // Check dependency existence.
        for (const dependencyId of newDependencies) {
            if (!taskExists(dependencyId)) {
                return res.status(404).json({
                    success: false,
                    message: `Dependency task ${dependencyId} does not exist`
                });
            }

            // A task cannot depend on itself.
            if (dependencyId === taskId) {
                return res.status(400).json({
                    success: false,
                    message: "A task cannot depend on itself"
                });
            }

            // Check circular dependency.
            if (
                createsCircularDependency(
                    taskId,
                    dependencyId
                )
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Circular dependency detected"
                });
            }
        }
    }

    // Create updated task object.
    const updatedTask = {
        ...task,

        title:
            title !== undefined
                ? title.trim()
                : task.title,

        description:
            description !== undefined
                ? description.trim()
                : task.description,

        priority:
            priority !== undefined
                ? priority
                : task.priority,

        status:
            status !== undefined
                ? status
                : task.status,

        assignedTo:
            assignedTo !== undefined
                ? assignedTo
                    ? String(assignedTo)
                    : null
                : task.assignedTo,

        dependencies: newDependencies,

        updatedAt: new Date().toISOString()
    };

    // Do not allow Done when dependencies are incomplete.
    if (
        updatedTask.status === "Done" &&
        !areDependenciesCompleted(updatedTask)
    ) {
        return res.status(400).json({
            success: false,
            message:
                "Task cannot be marked Done because dependencies are incomplete"
        });
    }

    tasks.set(taskId, updatedTask);

    res.json({
        success: true,
        message: "Task updated successfully",
        task: updatedTask
    });
});


// DELETE /api/tasks/:id
// DELETE TASK


router.delete("/:id", (req, res) => {
    const taskId = String(req.params.id);

    if (!tasks.has(taskId)) {
        return res.status(404).json({
            success: false,
            message: "Task not found"
        });
    }

    // Before deleting a task, check whether
    // other tasks depend on it.
    const dependentTasks = Array.from(tasks.values()).filter(
        (task) =>
            task.dependencies.includes(taskId)
    );

    if (dependentTasks.length > 0) {
        return res.status(400).json({
            success: false,
            message:
                "Cannot delete this task because other tasks depend on it",
            dependentTasks: dependentTasks.map(
                (task) => task.id
            )
        });
    }

    tasks.delete(taskId);

    res.json({
        success: true,
        message: "Task deleted successfully"
    });
});


// EXPORT ROUTER


module.exports = router;