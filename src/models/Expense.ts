import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript'
import Budget from "./Budget";

@Table({ tableName: 'expenses' })
export class Expense extends Model {
    @Column({ type: DataType.STRING(100), allowNull: false })
    declare name: string;

    @Column({ type: DataType.DECIMAL,allowNull: false })
    declare amount: number;

    @BelongsTo(() => Budget)
    declare budget: Budget;

    @ForeignKey(() => Budget)
    declare budgetId: number;

}

export default Expense;