import Expense from '../models/Expense.js'
import Budget from '../models/Budget.js'
import Goal from '../models/Goal.js'
import Investment from '../models/Investment.js'
import Groq from 'groq-sdk'



export const chat = async (req, res) => {
  try {
    const groq = new Groq({ apiKey: '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' })
    const { message, history } = req.body
    const userId = req.user._id

    const [expenses, budgets, goals, investments] = await Promise.all([
      Expense.find({ user: userId }),
      Budget.find({ user: userId }),
      Goal.find({ user: userId }),
      Investment.find({ user: userId })
    ])

    const expensesByCategory = expenses.reduce((acc, exp) => {
      acc[exp.category] = (acc[exp.category] || 0) + exp.amount
      return acc
    }, {})

    const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0)
    const totalInvested = investments.reduce((sum, inv) => sum + inv.amountInvested, 0)
    const totalPortfolioValue = investments.reduce((sum, inv) => sum + inv.currentValue, 0)

    const financialContext = `
You are BudgetBuddy AI, a personal finance advisor.
You have access to the user's real financial data.
Be specific, friendly, and actionable in your advice.
Always reference their actual numbers when giving advice.
Keep responses concise and clear.

USER'S FINANCIAL DATA:
======================
Total Expenses: KES ${totalExpenses.toLocaleString()}

Expenses by Category:
${Object.entries(expensesByCategory)
  .map(([cat, amt]) => `  - ${cat}: KES ${amt.toLocaleString()}`)
  .join('\n')}

Budgets:
${budgets.length === 0 ? '  No budgets set' :
  budgets.map(b => `  - ${b.category}: KES ${b.amount.toLocaleString()} spent of KES ${b.limit.toLocaleString()} limit (${b.month}/${b.year})`).join('\n')}

Savings Goals:
${goals.length === 0 ? '  No goals set' :
  goals.map(g => `  - ${g.title}: KES ${g.savedAmount.toLocaleString()} saved of KES ${g.targetAmount.toLocaleString()} target (deadline: ${new Date(g.deadline).toLocaleDateString()})`).join('\n')}

Investments:
${investments.length === 0 ? '  No investments' :
  investments.map(inv => `  - ${inv.name} (${inv.type}): Invested KES ${inv.amountInvested.toLocaleString()}, Now worth KES ${inv.currentValue.toLocaleString()}`).join('\n')}

Total Portfolio Value: KES ${totalPortfolioValue.toLocaleString()}
Total Invested: KES ${totalInvested.toLocaleString()}
Portfolio Return: KES ${(totalPortfolioValue - totalInvested).toLocaleString()}
`

    const messages = [
      { role: 'system', content: financialContext },
      ...(history || []),
      { role: 'user', content: message }
    ]

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages,
      max_tokens: 1024
    })

    const reply = completion.choices[0].message.content
    res.json({ reply })

  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}