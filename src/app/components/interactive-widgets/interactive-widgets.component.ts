import { Component, Input, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-interactive-widgets',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    @if (widgetType === 'freedom-ladder') {
      <div class="my-8 border border-ink-border rounded-xl p-6 bg-ink-surface shadow-xs space-y-4">
        <div class="flex items-center justify-between">
          <div>
            <h4 class="mono-label text-xs font-bold text-ink-accent">INTERACTIVE TOOL</h4>
            <h3 class="text-base font-bold text-ink-text font-serif">The Freedom Ladder (7 Rungs)</h3>
          </div>
          <span class="mono-label text-[10px] px-2 py-0.5 rounded bg-ink-accent/10 text-ink-accent font-bold">
            Rung {{ activeRung() }} of 7
          </span>
        </div>

        <p class="text-xs text-ink-muted font-serif">
          Check off the rungs of financial freedom you have achieved to measure your current structural independence.
        </p>

        <div class="space-y-2 mt-4">
          @for (rung of freedomRungs; track rung.id) {
            <div 
              class="p-3 rounded-lg border transition-all flex items-start gap-3 cursor-pointer select-none"
              [ngClass]="completedRungs().has(rung.id) ? 'border-ink-accent bg-ink-accent/5' : 'border-ink-border'"
              (click)="toggleRung(rung.id)"
            >
              <div 
                class="w-5 h-5 rounded flex items-center justify-center border text-xs font-bold shrink-0 mt-0.5 transition-colors"
                [ngClass]="completedRungs().has(rung.id) ? 'bg-ink-accent border-ink-accent text-white' : 'border-ink-border bg-ink-surface'"
              >
                {{ completedRungs().has(rung.id) ? '✓' : rung.id }}
              </div>
              <div class="flex-1">
                <div class="text-sm font-bold text-ink-text font-serif flex items-center justify-between">
                  <span>{{ rung.title }}</span>
                  <span class="mono-label text-[10px] text-ink-faint">{{ rung.metric }}</span>
                </div>
                <div class="text-xs text-ink-muted font-serif mt-0.5">{{ rung.desc }}</div>
              </div>
            </div>
          }
        </div>
      </div>
    }

    @if (widgetType === 'cashflow-calculator') {
      <div class="my-8 border border-ink-border rounded-xl p-6 bg-ink-surface shadow-xs space-y-4">
        <div>
          <h4 class="mono-label text-xs font-bold text-ink-accent">INTERACTIVE CALCULATOR</h4>
          <h3 class="text-base font-bold text-ink-text font-serif">Personal Cash-Flow & Surplus Engine</h3>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 font-sans text-xs">
          <div>
            <label class="block text-ink-muted mb-1 font-bold">Monthly Income ($)</label>
            <input 
              type="number" 
              [(ngModel)]="income" 
              class="w-full p-2 rounded bg-ink-surface-raised border border-ink-border text-ink-text outline-none focus:border-ink-accent"
            />
          </div>

          <div>
            <label class="block text-ink-muted mb-1 font-bold">Monthly Expenses ($)</label>
            <input 
              type="number" 
              [(ngModel)]="expenses" 
              class="w-full p-2 rounded bg-ink-surface-raised border border-ink-border text-ink-text outline-none focus:border-ink-accent"
            />
          </div>

          <div>
            <label class="block text-ink-muted mb-1 font-bold">Total Debts ($)</label>
            <input 
              type="number" 
              [(ngModel)]="debt" 
              class="w-full p-2 rounded bg-ink-surface-raised border border-ink-border text-ink-text outline-none focus:border-ink-accent"
            />
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-lg bg-ink-surface-raised border border-ink-border font-mono text-center">
          <div>
            <div class="text-[10px] text-ink-faint uppercase font-bold">Monthly Surplus</div>
            <div class="text-lg font-bold" [ngClass]="surplus() >= 0 ? 'text-emerald-500' : 'text-red-500'">
              \${{ surplus() | number }}
            </div>
          </div>

          <div>
            <div class="text-[10px] text-ink-faint uppercase font-bold">Savings Rate</div>
            <div class="text-lg font-bold text-ink-accent">
              {{ savingsRate() }}%
            </div>
          </div>

          <div>
            <div class="text-[10px] text-ink-faint uppercase font-bold">Emergency Buffer</div>
            <div class="text-lg font-bold text-ink-text">
              {{ emergencyMonths() }} Mos
            </div>
          </div>
        </div>
      </div>
    }

    @if (widgetType === 'compounding-simulator') {
      <div class="my-8 border border-ink-border rounded-xl p-6 bg-ink-surface shadow-xs space-y-4">
        <div>
          <h4 class="mono-label text-xs font-bold text-ink-accent">WEALTH RESERVOIR SIMULATOR</h4>
          <h3 class="text-base font-bold text-ink-text font-serif">The Compounding Power Engine</h3>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 font-sans text-xs">
          <div>
            <label class="block text-ink-muted mb-1 font-bold">Initial Capital ($)</label>
            <input 
              type="number" 
              [(ngModel)]="initialCapital" 
              class="w-full p-2 rounded bg-ink-surface-raised border border-ink-border text-ink-text outline-none focus:border-ink-accent"
            />
          </div>

          <div>
            <label class="block text-ink-muted mb-1 font-bold">Monthly Addition ($)</label>
            <input 
              type="number" 
              [(ngModel)]="monthlyContribution" 
              class="w-full p-2 rounded bg-ink-surface-raised border border-ink-border text-ink-text outline-none focus:border-ink-accent"
            />
          </div>

          <div>
            <label class="block text-ink-muted mb-1 font-bold">Years & Return Rate</label>
            <div class="flex items-center gap-2">
              <input 
                type="number" 
                [(ngModel)]="years" 
                placeholder="Yrs"
                class="w-1/2 p-2 rounded bg-ink-surface-raised border border-ink-border text-ink-text outline-none focus:border-ink-accent"
              />
              <input 
                type="number" 
                [(ngModel)]="annualReturn" 
                placeholder="%"
                class="w-1/2 p-2 rounded bg-ink-surface-raised border border-ink-border text-ink-text outline-none focus:border-ink-accent"
              />
            </div>
          </div>
        </div>

        <div class="p-4 rounded-lg bg-ink-surface-raised border border-ink-border flex items-center justify-between font-mono">
          <div>
            <div class="text-[10px] text-ink-faint uppercase font-bold">Total Capital Invested</div>
            <div class="text-base font-bold text-ink-text">\${{ totalInvested() | number }}</div>
          </div>

          <div class="text-right">
            <div class="text-[10px] text-ink-faint uppercase font-bold">Compounded Reservoir</div>
            <div class="text-xl font-bold text-emerald-500">\${{ futureValue() | number:'1.0-0' }}</div>
          </div>
        </div>
      </div>
    }
  `
})
export class InteractiveWidgetsComponent {
  @Input() widgetType: 'freedom-ladder' | 'cashflow-calculator' | 'compounding-simulator' = 'freedom-ladder';

  // Freedom Ladder
  freedomRungs = [
    { id: 1, title: '1. Cash Solvency', desc: 'Earning more than you spend permanently (building positive cash surplus).', metric: 'Surplus > $0' },
    { id: 2, title: '2. The Firewall', desc: '6-month emergency buffer + high-coverage independent health policy.', metric: '6 Months Expenses' },
    { id: 3, title: '3. Debt Freedom', desc: 'All high-interest liabilities, car loans, and consumer debts cleared.', metric: 'Zero High-Interest Debt' },
    { id: 4, title: '4. The 3-Year Runway', desc: 'Cash + liquid assets covering 36 months of expenses (enables structural pivots).', metric: '36 Months Buffer' },
    { id: 5, title: '5. Career Option Lock', desc: 'Having capital buffers to walk away from toxic workplaces and retrain.', metric: 'Career Optionality' },
    { id: 6, title: '6. Time Freedom', desc: 'Choosing where you live, when you work, and which managers/clients you accept.', metric: 'Location & Time Autonomy' },
    { id: 7, title: '7. Absolute Autonomy', desc: 'Working purely on chosen projects, self-funded, no required counterparties.', metric: 'Full Sovereign Capital' }
  ];

  completedRungs = signal<Set<number>>(new Set([1, 2]));

  toggleRung(id: number) {
    this.completedRungs.update(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  activeRung = computed(() => {
    let max = 0;
    for (const id of this.completedRungs()) {
      if (id > max) max = id;
    }
    return max;
  });

  // Cashflow Calculator
  income = 5000;
  expenses = 3200;
  debt = 12000;

  surplus = computed(() => this.income - this.expenses);
  savingsRate = computed(() => this.income > 0 ? Math.max(0, Math.round(((this.income - this.expenses) / this.income) * 100)) : 0);
  emergencyMonths = computed(() => this.expenses > 0 ? ((this.income - this.expenses) * 6 / this.expenses).toFixed(1) : 0);

  // Compounding Simulator
  initialCapital = 10000;
  monthlyContribution = 500;
  years = 10;
  annualReturn = 8;

  totalInvested = computed(() => this.initialCapital + (this.monthlyContribution * 12 * this.years));
  futureValue = computed(() => {
    const r = (this.annualReturn / 100) / 12;
    const n = this.years * 12;
    if (r === 0) return this.totalInvested();
    const fvInitial = this.initialCapital * Math.pow(1 + r, n);
    const fvAnnuity = this.monthlyContribution * ((Math.pow(1 + r, n) - 1) / r);
    return fvInitial + fvAnnuity;
  });
}
