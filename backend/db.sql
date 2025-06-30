-- Create the tasks table
CREATE TABLE tasks (
    task_id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    due_date VARCHAR(10), -- Stored as "YYYY-MM-DD"
    due_time VARCHAR(5),  -- Stored as "HH:MM"
    planned_completion_date VARCHAR(10), -- Stored as "YYYY-MM-DD"
    estimated_finish_time NUMERIC, -- Stored in hours
    status VARCHAR(20) NOT NULL DEFAULT 'pending', -- Allowed values: "pending", "in_progress", "completed"
    created_at VARCHAR(255) NOT NULL, -- Stored as ISO 8601 string
    updated_at VARCHAR(255) NOT NULL
);

-- Create indexes for performance
CREATE INDEX tasks_due_date_due_time_idx ON tasks (due_date, due_time);
CREATE INDEX tasks_status_idx ON tasks (status);
CREATE INDEX tasks_planned_completion_date_idx ON tasks (planned_completion_date);
CREATE INDEX tasks_title_idx ON tasks (title);

-- Seed the tasks table with example data
INSERT INTO tasks (title, description, due_date, due_time, planned_completion_date, estimated_finish_time, status, created_at, updated_at) VALUES
('Prepare Q4 Report', 'Compile all sales data and prepare the quarterly performance report for the board meeting.', '2023-11-15', '17:00', '2023-11-14', 8, 'in_progress', '2023-10-26T10:00:00Z', '2023-10-27T09:30:00Z'),
('Schedule Team Meeting', 'Organize and schedule the weekly sync-up meeting for the development team. Include agenda items.', '2023-10-30', '10:00', '2023-10-29', 1, 'pending', '2023-10-25T14:00:00Z', '2023-10-25T14:00:00Z'),
('Review PRD v1.1', 'Thoroughly review the updated Product Requirements Document for clarity and completeness.', '2023-11-01', '09:00', '2023-10-31', 4, 'pending', '2023-10-27T08:15:00Z', '2023-10-27T08:15:00Z'),
('Deploy Feature X to Staging', 'Push the latest build of Feature X to the staging environment for QA testing.', '2023-10-28', '16:00', '2023-10-28', 2, 'pending', '2023-10-26T11:30:00Z', '2023-10-26T11:30:00Z'),
('Update Documentation', 'Add new sections and examples to the user guide based on recent feature updates.', '2023-11-03', '17:00', '2023-11-02', 6, 'completed', '2023-10-20T09:00:00Z', '2023-10-24T15:45:00Z'),
('Research Competitor Pricing', 'Gather and analyze pricing models of key competitors in the market.', '', '', '2023-11-10', 5, 'pending', '2023-10-27T10:05:00Z', '2023-10-27T10:05:00Z'),
('Plan Holiday Party', 'Brainstorm ideas and create a preliminary budget for the company holiday party.', '2023-12-15', '12:00', '2023-11-30', 3, 'pending', '2023-10-27T11:00:00Z', '2023-10-27T11:00:00Z'),
('Fix Bug #1024', 'Investigate and resolve the critical bug reported in the user authentication module.', '2023-10-29', '17:00', '2023-10-28', 7, 'pending', '2023-10-27T13:00:00Z', '2023-10-27T13:00:00Z'),
('Create Marketing Copy', 'Write compelling copy for the new product launch campaign.', '2023-11-06', '17:00', '2023-11-05', 4, 'pending', '2023-10-26T15:00:00Z', '2023-10-26T15:00:00Z'),
('Onboard New Intern', 'Prepare onboarding materials and schedule introductory meetings for the new intern.', '2023-10-31', '09:30', '2023-10-30', 3, 'in_progress', '2023-10-27T14:20:00Z', '2023-10-27T14:20:00Z');