"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { tokens } from "@/lib/theme";
import { PrescriptionCamera } from "@/components/orders/prescription-camera";
import { useOrderStore } from "@/stores/order-store";
import { useAuthStore } from "@/stores/auth-store";
import type { Order } from "@/lib/types";
import { toast } from "sonner";

interface ScanReceivedDialogProps {
  open: boolean;
  onClose: () => void;
}

export function ScanReceivedDialog({ open, onClose }: ScanReceivedDialogProps) {
  const session = useAuthStore((s) => s.session);
  const matchOrder = useOrderStore((s) => s.matchOrder);
  const moveOrder = useOrderStore((s) => s.moveOrder);

  const [mode, setMode] = useState<"choose" | "scan" | "search" | "results">("choose");
  const [searchQuery, setSearchQuery] = useState("");
  const [matches, setMatches] = useState<Order[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  function reset() { setMode("choose"); setSearchQuery(""); setMatches([]); setIsSearching(false); }
  function handleClose() { reset(); onClose(); }

  async function handleScanCapture(_dataUri: string) {
    if (!session) return;
    setIsSearching(true);
    await new Promise((r) => setTimeout(r, 1000));
    const results = await matchOrder(session.tenantId, "");
    setMatches(results.filter((o) => o.stage === "ordered_awaiting_delivery"));
    setIsSearching(false);
    setMode("results");
  }

  async function handleSearch() {
    if (!session || !searchQuery.trim()) return;
    setIsSearching(true);
    const results = await matchOrder(session.tenantId, searchQuery.trim());
    setMatches(results.filter((o) => o.stage === "ordered_awaiting_delivery"));
    setIsSearching(false);
    setMode("results");
  }

  async function handleMoveOrder(orderId: string) {
    if (!session) return;
    await moveOrder(session.tenantId, orderId, "received_ready_to_assemble");
    toast.success("Order moved to Ready to Assemble");
    handleClose();
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Scan Received Orders</DialogTitle>
        </DialogHeader>

        {mode === "choose" && (
          <div className="space-y-3">
            <p className={`${tokens.fontSize.body} text-text-muted`}>Match a received delivery to an existing order</p>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="h-20 flex-col gap-1" onClick={() => setMode("scan")}>
                <span className="text-lg">📸</span>
                <span className={tokens.fontSize.body}>Scan Package</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col gap-1" onClick={() => setMode("search")}>
                <span className="text-lg">🔍</span>
                <span className={tokens.fontSize.body}>Search by Name</span>
              </Button>
            </div>
          </div>
        )}

        {mode === "scan" && (
          <div className="space-y-3">
            <p className={`${tokens.fontSize.body} text-text-muted`}>Take a photo of the delivery package label</p>
            <PrescriptionCamera onCapture={handleScanCapture} />
            <Button variant="ghost" onClick={() => setMode("choose")}>Back</Button>
          </div>
        )}

        {mode === "search" && (
          <div className="space-y-3">
            <div className="flex gap-2">
              <Input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Client name..." onKeyDown={(e) => e.key === "Enter" && handleSearch()} />
              <Button onClick={handleSearch} disabled={isSearching}>{isSearching ? "..." : "Search"}</Button>
            </div>
            <Button variant="ghost" onClick={() => setMode("choose")}>Back</Button>
          </div>
        )}

        {mode === "results" && (
          <div className="space-y-3">
            {isSearching ? (
              <div className={`text-center ${tokens.fontSize.body} text-text-muted py-4`}>Searching...</div>
            ) : matches.length === 0 ? (
              <div className={`text-center ${tokens.fontSize.body} text-text-muted py-4`}>No matching orders awaiting delivery</div>
            ) : (
              <div className="space-y-2">
                <p className={`${tokens.fontSize.body} text-text-muted`}>Select an order to mark as received:</p>
                {matches.map((order) => (
                  <button
                    key={order.id}
                    onClick={() => handleMoveOrder(order.id)}
                    className={`w-full text-left ${tokens.spacing.card} ${tokens.radius.card} border hover:bg-surface-muted transition-colors`}
                  >
                    <div className={`font-medium ${tokens.fontSize.body}`}>{order.clientName}</div>
                    <div className={`${tokens.fontSize.caption} text-text-muted`}>{order.frameDescription} — {order.lensType}</div>
                  </button>
                ))}
              </div>
            )}
            <Button variant="ghost" onClick={() => setMode("choose")}>Back</Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
