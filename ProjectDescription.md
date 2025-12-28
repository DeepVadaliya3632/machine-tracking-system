Role: You are an expert Full-stack Engineer specializing in industrial monitoring systems.

Task: Create a robust Machine Tracking Dashboard for 50 machines. Each machine has a goal of 80 continuous hours.

Core Requirements:

    50 Machine Tiles: Display a grid of 50 machines. Each tile must show:

        Machine ID (MAC-01 to MAC-50).

        Current Status (Running, Paused, Completed).

        Live Progress Bar: Visual representation of 0 to 80 hours.

        Accumulated Time: Total time worked in HH:MM:SS.

        Estimated Completion Time (ECT): A dynamic column/field showing the exact date and time the machine will hit 80 hours based on its current progress. (Hide if status is Paused).

    Logic (Timestamp-based):

        DO NOT use simple setInterval counters that reset on refresh.

        Use timestamps (Start Time, Current Time, Accumulated Seconds). If the page refreshes, the app must calculate the elapsed time from the database/storage to remain accurate.

    The "Global Power Outage" Button:

        Place a prominent "POWER OUTAGE - STOP ALL" button at the top.

        When clicked, it must immediately stop the timer for all 50 machines and save their current accumulated progress to the database.

    Individual Controls: Each machine needs its own Start, Pause, and Reset buttons.

Tech Stack Preferences:

    Frontend: React with Tailwind CSS (Clean, industrial dark mode UI).

    Data Handling: Use a robust local state management (like Lucide icons for UI and a local storage or Supabase backend) to ensure data persists after a power cut or refresh.

Feature Added: * Alert System: Highlight the machine tile in Red when it reaches 80 hours and send a browser notification.