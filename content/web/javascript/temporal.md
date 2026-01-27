---
sidebar_position: 8
tags: [Web, JavaScript, ECMAScript, Date, Temporal]
---

# Temporal

## Legacy

```ts
const now = new Date()
now.getFullYear() // 1-n
now.getMonth() // Warn: 0-11
now.getDate() // 1-n
now.getDay() // Warn: 0-6
now.getHours()
now.getSeconds()
now.toString()
now.toDateString()
now.toTimeString()
now.toUTCString()
now.toLocaleString()
now.toLocaleDateString()
now.toLocaleTimeString()

function daysOfMonth(year, month) {
  // `0` for last month of next month
  return new Date(year, month + 1, 0).getDate()
}

function prevYear(year) {
  return new Date(year - 1, 0).getFullYear()
}

function nextYear(year) {
  return new Date(year + 1, 0).getFullYear()
}

function prevMonth(year, month) {
  return new Date(year, month - 1).getMonth()
}

function nextMonth(year, month) {
  return new Date(year, month + 1).getMonth()
}
```

```ts
function getDateItemList(year, month) {
  const days = daysOfMonth(year, month)
  const currentDateItemList = [...Array.from({ length: days }).keys()].map((index) => {
    return DateItem(year, month, 1 + index)
  })

  const firstDayItem = DateItem(year, month, 1)
  const firstDayWeekday = firstDayItem.day
  const lastMonthDays = daysOfMonth(year, month - 1)
  const prefixDays = firstDayWeekday === 0 ? 7 : firstDayWeekday
  const prefixFirstDay = lastMonthDays - prefixDays + 1
  const prefixYear = prevYear(year)
  const prefixMonth = prevMonth(year, month)
  const prefixDateItemList = [...Array.from({ length: prefixDays }).keys()].map((index) => {
    return DateItem(prefixYear, prefixMonth, prefixFirstDay + index)
  })

  const lastDayItem = DateItem(year, month, days)
  const lastDayWeekday = lastDayItem.day
  const suffixDays = lastDayWeekday === 6 ? 7 : 6 - lastDayWeekday
  const suffixYear = nextYear(year)
  const suffixMonth = nextMonth(year, month)
  const suffixDateItemList = [...Array.from({ length: suffixDays }).keys()].map((index) => {
    return DateItem(suffixYear, suffixMonth, 1 + index)
  })

  const dateItemList = [
    ...prefixDateItemList,
    ...currentDateItemList,
    ...suffixDateItemList,
  ]

  return dateItemList
}
```

## Modern

```ts
Temporal.ZonedDateTime.from({
  year,
  month,
  day,
  timeZone: Temporal.Now.timeZone(),
})

Temporal.ZonedDateTime.from({
  year,
  month,
  day,
  hour,
  minute,
  timeZone: Temporal.Now.timeZone(),
})

const second = Temporal.Now.zonedDateTimeISO().second
const hour = Temporal.Now.zonedDateTimeISO().hour
const day = Temporal.Now.zonedDateTimeISO().day

Temporal.Now.zonedDateTimeISO().with({ second: 30 })
Temporal.Now.zonedDateTimeISO().with({ hour: 13 })
Temporal.Now.zonedDateTimeISO().with({ day: 1 })
Temporal.Now.zonedDateTimeISO().withPlainTime(
  new Temporal.PlainTime(23, 59, 59, 999, 999, 999)
)
```

## Range

```ts
const dayOfWeek = Temporal.Now.zonedDateTimeISO().dayOfWeek
const dayOfYear = Temporal.Now.zonedDateTimeISO().dayOfYear
const daysInMonth = new Temporal.PlainYearMonth(2012, 2).daysInMonth
const daysInMonth = Temporal.PlainYearMonth.from('2012-02').daysInMonth
const weekOfYear = Temporal.Now.zonedDateTimeISO().weekOfYear
const weekOfYear = Temporal.PlainDate.from({
  day: 31,
  month: 12,
  year: Temporal.Now.plainDateISO(),
}).weekOfYear
const inLeapYear = Temporal.PlainDate.from('2000-01-01').inLeapYear

Temporal.Now.zonedDateTimeISO().add(Temporal.Duration.from({ days: 7 }))
Temporal.Now.zonedDateTimeISO().subtract(Temporal.Duration.from({ days: 14 }))
Temporal.Now.zonedDateTimeISO()
  .with({ month: 1, day: 1 })
  .add(Temporal.Duration.from({ days: 256 }))
Temporal.Now.zonedDateTimeISO()
  .with({ month: 1, day: 1 })
  .add(Temporal.Duration.from({ weeks: 23 }))

Temporal.Instant.fromEpochMilliseconds(Math.max.apply(null, dateArrays))
Temporal.Instant.fromEpochMilliseconds(Math.min.apply(null, dateArrays))
```

## Display

```ts
new Intl.DateTimeFormat('en-GB', {
  dateStyle: 'full',
  timeStyle: 'medium',
}).format(Temporal.Now.zonedDateTimeISO())
new Intl.DateTimeFormat('de-DE', { weekday: 'short', hour: 'numeric' }).format(
  Temporal.Now.zonedDateTimeISO()
)

Temporal.PlainDate.from('2007-01-27').until('2007-01-29')
Temporal.PlainDate.from('2007-01-27')
  .since('2007-01-29')
  .total({ unit: 'millisecond' })
Temporal.PlainDate.from('2007-01-27').since('2007-01-29').total({ unit: 'day' })
```

## Query

```ts
const isBefore = Temporal.PlainDate.compare('2010-10-20', '2010-10-21') === -1
const isAfter = Temporal.PlainDate.compare('2010-10-20', '2010-10-19') === 1
const isEqual = Temporal.PlainDate.from('2010-10-20').equals('2010-10-21')
const isEqual = Temporal.PlainDate.from('2010-10-20').equals('2010-10-20')
const isEqual
  = Temporal.PlainDate.from('2010-10-20').month === Temporal.PlainDate.from('2010-10-21').month

const isPlainTime = Temporal.Now.plainTimeISO() instanceof Temporal.PlainTime
const isPlainDate = Temporal.Now.plainDateISO() instanceof Temporal.PlainDate
const isPlainDateTime
  = Temporal.Now.plainDateTimeISO() instanceof Temporal.PlainDateTime
const isZonedDateTime
  = Temporal.Now.zonedDateTimeISO() instanceof Temporal.ZonedDateTime
```

## References

- Date definitive [guide](https://css-tricks.com/everything-you-need-to-know-about-date-in-javascript).
- Temporal [cookbook](https://github.com/you-dont-need/You-Dont-Need-Momentjs).
- Temporal [playground](https://github.com/javierOrtega95/temporal-playground).
