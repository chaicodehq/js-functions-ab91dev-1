/**
 * 🍱 Mumbai Tiffin Service - Plan Builder
 *
 * Mumbai ki famous tiffin delivery service hai. Customer ka plan banana hai
 * using destructuring parameters aur rest/spread operators.
 *
 * Functions:
 *
 *   1. createTiffinPlan({ name, mealType = "veg", days = 30 })
 *      - Destructured parameter with defaults!
 *      - Meal prices per day: veg=80, nonveg=120, jain=90
 *      - Agar mealType unknown hai, return null
 *      - Agar name missing/empty, return null
 *      - Return: { name, mealType, days, dailyRate, totalCost }
 *
 *   2. combinePlans(...plans)
 *      - Rest parameter! Takes any number of plan objects
 *      - Each plan: { name, mealType, days, dailyRate, totalCost }
 *      - Return: { totalCustomers, totalRevenue, mealBreakdown }
 *      - mealBreakdown: { veg: count, nonveg: count, ... }
 *      - Agar koi plans nahi diye, return null
 *
 *   3. applyAddons(plan, ...addons)
 *      - plan: { name, mealType, days, dailyRate, totalCost }
 *      - Each addon: { name: "raita", price: 15 }
 *      - Add each addon price to dailyRate
 *      - Recalculate totalCost = new dailyRate * days
 *      - Return NEW plan object (don't modify original)
 *      - addonNames: array of addon names added
 *      - Agar plan null hai, return null
 *
 * Hint: Use { destructuring } in params, ...rest for variable args,
 *   spread operator for creating new objects
 *
 * @example
 *   createTiffinPlan({ name: "Rahul" })
 *   // => { name: "Rahul", mealType: "veg", days: 30, dailyRate: 80, totalCost: 2400 }
 *
 *   combinePlans(plan1, plan2, plan3)
 *   // => { totalCustomers: 3, totalRevenue: 7200, mealBreakdown: { veg: 2, nonveg: 1 } }
 */
export function createTiffinPlan({ name, mealType = "veg", days = 30 } = {}) {
  // Your code here
  const prices = { veg: 80, nonveg: 120, jain: 90 };

  if (!name || !name.trim()) return null;
  if (!(mealType in prices)) return null;

  const dailyRate = prices[mealType];
  return { name, mealType, days, dailyRate, totalCost: dailyRate * days };
}

export function combinePlans(...plans) {
  // Your code here
  if (!plans.length) return null;

  const mealBreakdown = {};
  let totalRevenue = 0;

  for (const plan of plans) {
    totalRevenue += plan.totalCost;
    mealBreakdown[plan.mealType] = (mealBreakdown[plan.mealType] || 0) + 1;
  }

  return { totalCustomers: plans.length, totalRevenue, mealBreakdown };
}

export function applyAddons(plan, ...addons) {
  // Your code here
  if (!plan) return null;

  const addonNames = addons.map((a) => a.name);
  const extraCost = addons.reduce((sum, a) => sum + a.price, 0);
  const dailyRate = plan.dailyRate + extraCost;

  return { ...plan, dailyRate, totalCost: dailyRate * plan.days, addonNames };
}
