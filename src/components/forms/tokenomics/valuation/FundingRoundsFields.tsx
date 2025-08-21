import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { ValuationInput, FundingRound } from "@/types/valuation";

interface FundingRoundsFieldsProps {
  formData: ValuationInput;
  onFieldChange: (field: keyof ValuationInput, value: any) => void;
}

export const FundingRoundsFields = ({ formData, onFieldChange }: FundingRoundsFieldsProps) => {
  const rounds: FundingRound[] = formData.fundingRounds || [];

  const [draft, setDraft] = React.useState<FundingRound>({
    name: '',
    amount: 0,
    tokenPrice: 0,
    fundraisingMethod: 'Seed',
    dilution: 0,
    date: ''
  });

  const addRound = () => {
    if (!draft.name || draft.amount <= 0) return;
    const next = [...rounds, draft];
    onFieldChange('fundingRounds', next);
    setDraft({ name: '', amount: 0, tokenPrice: 0, fundraisingMethod: 'Seed', dilution: 0, date: '' });
  };

  const removeRound = (index: number) => {
    const next = rounds.filter((_, i) => i !== index);
    onFieldChange('fundingRounds', next);
  };

  const formatCurrency = (v: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(v || 0);
  const formatPercent = (v?: number) => `${(v ?? 0).toFixed(0)}%`;
  const formatDate = (iso?: string) => iso ? new Date(iso).toLocaleDateString('en-GB').replace(/\//g, '. ') : 'N/A';

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h4 className="text-base font-semibold">Add Funding Round</h4>
        <p className="text-sm text-muted-foreground">Track new investments and calculate dilution impact</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
        <div className="space-y-2">
          <Label>Round Name</Label>
          <Input placeholder="e.g. Seed Round" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label>Amount ($)</Label>
          <Input type="number" value={draft.amount} onChange={(e) => setDraft({ ...draft, amount: Number(e.target.value) })} />
        </div>
        <div className="space-y-2">
          <Label>Round Type</Label>
          <Select value={draft.fundraisingMethod} onValueChange={(v: FundingRound['fundraisingMethod']) => setDraft({ ...draft, fundraisingMethod: v })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Pre-Seed">Pre-Seed</SelectItem>
              <SelectItem value="Seed">Seed</SelectItem>
              <SelectItem value="Private Sale">Private Sale</SelectItem>
              <SelectItem value="IDO">IDO</SelectItem>
              <SelectItem value="Fair Launch">Fair Launch</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Dilution (%)</Label>
          <Input type="number" value={draft.dilution ?? 0} onChange={(e) => setDraft({ ...draft, dilution: Number(e.target.value) })} />
        </div>
        <div className="space-y-2">
          <Label>Token Price ($)</Label>
          <Input type="number" step="0.0001" value={draft.tokenPrice} onChange={(e) => setDraft({ ...draft, tokenPrice: Number(e.target.value) })} />
        </div>
        <div className="flex items-end">
          <Button type="button" className="w-full" onClick={addRound}>Add Round</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="space-y-2">
          <Label>Date</Label>
          <Input type="date" value={draft.date ?? ''} onChange={(e) => setDraft({ ...draft, date: e.target.value })} />
        </div>
      </div>

      <div className="space-y-2 pt-2">
        <h4 className="text-base font-semibold">Funding History</h4>
        <p className="text-sm text-muted-foreground">Complete funding timeline and dilution tracking</p>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Round</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Dilution</TableHead>
            <TableHead>Token Price</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rounds.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-muted-foreground">No rounds added yet</TableCell>
            </TableRow>
          ) : (
            rounds.map((r, i) => (
              <TableRow key={`${r.name}-${i}`}>
                <TableCell>{r.name}</TableCell>
                <TableCell className="uppercase text-xs font-semibold">{r.fundraisingMethod}</TableCell>
                <TableCell>{formatCurrency(r.amount)}</TableCell>
                <TableCell>{formatDate(r.date)}</TableCell>
                <TableCell>{formatPercent(r.dilution)}</TableCell>
                <TableCell>{r.tokenPrice > 0 ? `$${r.tokenPrice.toFixed(2)}` : 'N/A'}</TableCell>
                <TableCell className="text-right">
                  <Button type="button" variant="outline" onClick={() => removeRound(i)}>Remove</Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};



