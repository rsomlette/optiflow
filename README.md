# OptiFlow

**Track glass orders from prescription to pickup.**

OptiFlow is a tablet-optimized order tracking tool built for optician shops. It replaces sticky notes, spreadsheets, and guesswork with a visual Kanban board that the whole team can see at a glance.

## What It Does

When a client walks into your shop, the flow is simple:

1. **Snap the prescription** — Take a photo of the doctor's prescription. OCR extracts the data automatically, or fill it in manually.
2. **Create the order** — Assign it to an employee. The order card appears on the board.
3. **Track the progress** — Drag cards across five stages:

   | Stage | What Happens |
   |---|---|
   | **Pending Order** | Prescription captured, ready to place the order |
   | **Ordered — Awaiting Delivery** | Lenses/frames ordered from supplier |
   | **Received — Ready to Assemble** | Parts arrived, waiting for assembly |
   | **In Assembly** | Glasses being assembled |
   | **Ready for Pickup** | Done! Notify the client |

4. **Scan deliveries** — When a shipment arrives, scan it to automatically match and move the right order.
5. **Notify & close** — When glasses are ready, notify the client and mark the order as picked up.

## Who It's For

- **Optician shops** looking for a simple, visual way to track orders
- **Multi-location businesses** — each shop gets its own dashboard
- **Teams** — all employees in a shop share the same live board

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser (best experienced on a tablet).

## Tech Stack

- [Next.js](https://nextjs.org) (App Router)
- TypeScript
- Tailwind CSS + shadcn/ui
- @dnd-kit for touch-friendly drag & drop
- Zustand for state management
