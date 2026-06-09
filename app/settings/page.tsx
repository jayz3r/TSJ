'use client';

import { useForm } from 'react-hook-form';
import { Card, CardHeader, Button, FormInput, FormSelect, PageHeader } from '@/components/ui';

interface HouseSettings {
  name:        string;
  address:     string;
  apartments:  number;
  totalArea:   number;
  bankAccount: string;
  bankName:    string;
}

interface TariffSettings {
  ratePerSqm:     number;
  lateFeePercent: number;
  accrualDay:     number;
  defaultPeriod:  string;
}

export default function SettingsPage() {
  const houseForm = useForm<HouseSettings>({
    defaultValues: {
      name:        'ТСЖ «Весна»',
      address:     'ул. Ленина, 12',
      apartments:  48,
      totalArea:   2184,
      bankAccount: '1070010100000012345',
      bankName:    'Оптима Банк',
    },
  });

  const tariffForm = useForm<TariffSettings>({
    defaultValues: {
      ratePerSqm:     57,
      lateFeePercent: 0.5,
      accrualDay:     1,
      defaultPeriod:  'monthly',
    },
  });

  return (
    <div>
      <PageHeader title="Настройки" />

      <div className="grid grid-cols-2 gap-4">
        {/* О доме */}
        <Card>
          <CardHeader title="О доме" />
          <form
            onSubmit={houseForm.handleSubmit(() => alert('Сохранено!'))}
            className="p-5 space-y-4"
          >
            <FormInput label="Название ТСЖ"    {...houseForm.register('name')}        />
            <FormInput label="Адрес дома"      {...houseForm.register('address')}     />
            <div className="grid grid-cols-2 gap-3">
              <FormInput label="Кол-во квартир"     type="number" {...houseForm.register('apartments')} />
              <FormInput label="Общая площадь (м²)" type="number" {...houseForm.register('totalArea')}  />
            </div>
            <FormInput label="Расчётный счёт" {...houseForm.register('bankAccount')} />
            <FormInput label="Банк"           {...houseForm.register('bankName')}    />
            <Button type="submit" variant="primary">💾 Сохранить</Button>
          </form>
        </Card>

        <div className="space-y-4">
          {/* Тарифы */}
          <Card>
            <CardHeader title="Тарифы и начисления" />
            <form
              onSubmit={tariffForm.handleSubmit(() => alert('Сохранено!'))}
              className="p-5 space-y-4"
            >
              <div className="grid grid-cols-2 gap-3">
                <FormInput
                  label="Базовый взнос (сом/м²)"
                  type="number"
                  step="0.1"
                  {...tariffForm.register('ratePerSqm')}
                />
                <FormInput
                  label="Пени (%/мес.)"
                  type="number"
                  step="0.1"
                  {...tariffForm.register('lateFeePercent')}
                />
              </div>
              <FormInput
                label="День начисления (число месяца)"
                type="number"
                min={1}
                max={28}
                {...tariffForm.register('accrualDay')}
              />
              <FormSelect label="Период по умолчанию" {...tariffForm.register('defaultPeriod')}>
                <option value="monthly">Ежемесячный</option>
                <option value="quarterly">Ежеквартальный</option>
              </FormSelect>
              <Button type="submit" variant="primary">💾 Сохранить</Button>
            </form>
          </Card>

          {/* Администратор */}
          <Card>
            <CardHeader title="Администратор" />
            <div className="p-5 space-y-3">
              <div className="flex items-center gap-3 p-3 bg-stone-50 rounded-lg border border-stone-200">
                <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center text-sm font-semibold text-emerald-700">
                  АД
                </div>
                <div>
                  <p className="text-sm font-medium text-stone-800">Администратор</p>
                  <p className="text-xs text-stone-400">admin@tszh-vesna.kg</p>
                </div>
              </div>
              <Button variant="secondary" className="w-full justify-center">
                🔒 Сменить пароль
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}