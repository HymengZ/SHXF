// 所属年度
const year = {
    label: '所属年度',
    filterState: [
        {
            label: '全部',
            value: '',
        },
        {
            label: new Date().getFullYear(),
            value: new Date().getFullYear(),
        },
        {
            label: new Date().getFullYear() - 1,
            value: new Date().getFullYear() - 1,
        },
        {
            label: new Date().getFullYear() - 2,
            value: new Date().getFullYear() - 2,
        },
        {
            label: new Date().getFullYear() - 3,
            value: new Date().getFullYear() - 3,
        },
        {
            label: new Date().getFullYear() - 4,
            value: new Date().getFullYear() - 4,
        },
    ],
}

// 新搜索框所属年度
const newYear = {
    label: '所属年度',
    item: 'year',
    filterState: [
        {
            label: '全部',
            value: '',
            checked: true,
        },
        {
            label: new Date().getFullYear(),
            value: new Date().getFullYear(),
            checked: false,
        },
        {
            label: new Date().getFullYear() - 1,
            value: new Date().getFullYear() - 1,
            checked: false,
        },
        {
            label: new Date().getFullYear() - 2,
            value: new Date().getFullYear() - 2,
            checked: false,
        },
        {
            label: new Date().getFullYear() - 3,
            value: new Date().getFullYear() - 3,
            checked: false,
        },
        {
            label: new Date().getFullYear() - 4,
            value: new Date().getFullYear() - 4,
            checked: false,
        },
    ],
}
const selectYear = [{ value: new Date().getFullYear() },
{ value: new Date().getFullYear() - 1 },
{ value: new Date().getFullYear() - 2 },
{ value: new Date().getFullYear() - 3 },
{ value: new Date().getFullYear() - 4 }]

export function getYear() {
    return year
}
export function getNewYear() {
    return newYear
}
export function getSelectYear() {
    return selectYear
}