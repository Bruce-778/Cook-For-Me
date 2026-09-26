"use client";

import Link from "next/link";
import {
  AlarmClock,
  ArrowLeft,
  Check,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  Clock3,
  Droplets,
  Flame,
  ListChecks,
  Pause,
  Play,
  RotateCcw,
  ThermometerSun,
  TimerReset,
  Utensils,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import type { Recipe } from "@/lib/recipes";
import { stepIngredientLabels } from "@/lib/step-ingredients";
import { cn } from "@/lib/utils";

type TimerState = {
  initialSeconds: number;
  remainingSeconds: number;
  targetEndAt: number | null;
  running: boolean;
};

type CookingSession = {
  version: 1;
  slug: string;
  servings: number;
  currentStep: number;
  completedSteps: number[];
  timers: Record<number, TimerState>;
  updatedAt: number;
};

const SESSION_PREFIX = "cfm:v1:cooking-session:";

function secondsFromLabel(label?: string) {
  if (!label) return 0;
  const minutes = label.match(/([\d.]+)\s*分钟/);
  const seconds = label.match(/([\d.]+)\s*秒/);
  return Math.round((minutes ? Number(minutes[1]) * 60 : 0) + (seconds ? Number(seconds[1]) : 0));
}

function formatTime(totalSeconds: number) {
  const safeSeconds = Math.max(0, Math.ceil(totalSeconds));
  const minutes = Math.floor(safeSeconds / 60);
  const seconds = safeSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function normalizeTimer(timer: TimerState, now = Date.now()): TimerState {
  if (!timer.running || !timer.targetEndAt) return timer;
  const remainingSeconds = Math.max(0, Math.ceil((timer.targetEndAt - now) / 1000));
  return remainingSeconds === 0
    ? { ...timer, remainingSeconds: 0, targetEndAt: null, running: false }
    : { ...timer, remainingSeconds };
}

function readSession(key: string, recipe: Recipe, servings: number): CookingSession | null {
  try {
    const raw: unknown = JSON.parse(localStorage.getItem(key) ?? "null");
    if (!raw || typeof raw !== "object") return null;
    const value = raw as Partial<CookingSession>;
    if (
      value.version !== 1 ||
      value.slug !== recipe.slug ||
      value.servings !== servings ||
      typeof value.currentStep !== "number" ||
      !Array.isArray(value.completedSteps) ||
      !value.timers ||
      typeof value.timers !== "object"
    ) return null;

    const currentStep = Math.min(Math.max(0, value.currentStep), recipe.steps.length - 1);
    const completedSteps = value.completedSteps.filter(
      (step): step is number => Number.isInteger(step) && step >= 0 && step < recipe.steps.length,
    );
    const timers = Object.fromEntries(
      Object.entries(value.timers).flatMap(([index, timer]) => {
        if (!timer || typeof timer !== "object") return [];
        const candidate = timer as Partial<TimerState>;
        if (
          typeof candidate.initialSeconds !== "number" ||
          typeof candidate.remainingSeconds !== "number" ||
          typeof candidate.running !== "boolean" ||
          (candidate.targetEndAt !== null && typeof candidate.targetEndAt !== "number")
        ) return [];
        return [[Number(index), normalizeTimer(candidate as TimerState)]];
      }),
    );
    return { version: 1, slug: recipe.slug, servings, currentStep, completedSteps, timers, updatedAt: Date.now() };
  } catch {
    return null;
  }
}

export function CookingMode({ recipe, servings }: { recipe: Recipe; servings: number }) {
  const sessionKey = `${SESSION_PREFIX}${recipe.slug}:${servings}`;
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [timers, setTimers] = useState<Record<number, TimerState>>({});
  const [hydrated, setHydrated] = useState(false);
  const [restored, setRestored] = useState(false);
  const [wakeLockUnavailable, setWakeLockUnavailable] = useState(false);
  const [now, setNow] = useState(() => Date.now());
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);
  const notifiedTimerRef = useRef("");

  const step = recipe.steps[currentStep];
  const baseTimerSeconds = step.timerSeconds || secondsFromLabel(step.time);
  const storedTimer = timers[currentStep];
  const timer = storedTimer ? normalizeTimer(storedTimer, now) : {
    initialSeconds: baseTimerSeconds,
    remainingSeconds: baseTimerSeconds,
    targetEndAt: null,
    running: false,
  };
  const progress = ((currentStep + (completedSteps.includes(currentStep) ? 1 : 0)) / recipe.steps.length) * 100;

  const stepIngredients = useMemo(() => stepIngredientLabels(recipe, step, servings), [recipe, step, servings]);

  useEffect(() => {
    document.body.classList.add("cooking-mode-active");
    const restoreTask = window.setTimeout(() => {
      const saved = readSession(sessionKey, recipe, servings);
      if (saved) {
        setCurrentStep(saved.currentStep);
        setCompletedSteps(saved.completedSteps);
        setTimers(saved.timers);
        setRestored(true);
      }
      setHydrated(true);
    }, 0);
    return () => {
      window.clearTimeout(restoreTask);
      document.body.classList.remove("cooking-mode-active");
    };
  }, [recipe, servings, sessionKey]);

  useEffect(() => {
    if (!hydrated) return;
    const session: CookingSession = {
      version: 1,
      slug: recipe.slug,
      servings,
      currentStep,
      completedSteps,
      timers,
      updatedAt: Date.now(),
    };
    try { localStorage.setItem(sessionKey, JSON.stringify(session)); } catch { /* Cooking remains available without storage. */ }
  }, [completedSteps, currentStep, hydrated, recipe.slug, servings, sessionKey, timers]);

  useEffect(() => {
    if (!Object.values(timers).some((item) => item.running)) return;
    const interval = window.setInterval(() => {
      const nextNow = Date.now();
      setNow(nextNow);
      setTimers((current) => Object.fromEntries(
        Object.entries(current).map(([index, item]) => [index, normalizeTimer(item, nextNow)]),
      ));
    }, 500);
    return () => window.clearInterval(interval);
  }, [timers]);

  useEffect(() => {
    const key = `${currentStep}:${timer.initialSeconds}`;
    if (timer.initialSeconds <= 0 || timer.remainingSeconds !== 0 || notifiedTimerRef.current === key) return;
    notifiedTimerRef.current = key;
    navigator.vibrate?.([180, 100, 180]);
    try {
      const AudioContextClass = window.AudioContext;
      const audio = new AudioContextClass();
      const oscillator = audio.createOscillator();
      const gain = audio.createGain();
      oscillator.frequency.value = 880; gain.gain.value = 0.08;
      oscillator.connect(gain); gain.connect(audio.destination); oscillator.start(); oscillator.stop(audio.currentTime + 0.35);
      oscillator.addEventListener("ended", () => void audio.close(), { once: true });
    } catch { /* Visual completion state remains available. */ }
  }, [currentStep, timer.initialSeconds, timer.remainingSeconds]);

  const requestWakeLock = useCallback(async () => {
    if (!("wakeLock" in navigator)) {
      setWakeLockUnavailable(true);
      return;
    }
    try {
      wakeLockRef.current = await navigator.wakeLock.request("screen");
      setWakeLockUnavailable(false);
    } catch {
      setWakeLockUnavailable(true);
    }
  }, []);

  useEffect(() => {
    const initialRequest = window.setTimeout(() => void requestWakeLock(), 0);
    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") void requestWakeLock();
    };
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      window.clearTimeout(initialRequest);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      void wakeLockRef.current?.release();
      wakeLockRef.current = null;
    };
  }, [requestWakeLock]);

  function updateTimer(next: TimerState) {
    setTimers((current) => ({ ...current, [currentStep]: next }));
  }

  function toggleTimer() {
    if (!baseTimerSeconds) return;
    // Event handlers intentionally read wall-clock time so background tabs do not cause timer drift.
    const timestamp = Date.now();
    if (timer.running) {
      updateTimer({ ...timer, remainingSeconds: Math.max(0, Math.ceil(((timer.targetEndAt ?? timestamp) - timestamp) / 1000)), targetEndAt: null, running: false });
    } else {
      const remainingSeconds = timer.remainingSeconds || timer.initialSeconds || baseTimerSeconds;
      updateTimer({ ...timer, remainingSeconds, targetEndAt: timestamp + remainingSeconds * 1000, running: true });
    }
  }

  function resetTimer() {
    updateTimer({ initialSeconds: baseTimerSeconds, remainingSeconds: baseTimerSeconds, targetEndAt: null, running: false });
  }

  function addThirtySeconds() {
    const remainingSeconds = timer.remainingSeconds + 30;
    const timestamp = Date.now();
    updateTimer({ ...timer, remainingSeconds, targetEndAt: timer.running ? timestamp + remainingSeconds * 1000 : null });
  }

  function goToStep(index: number) {
    setCurrentStep(Math.min(Math.max(index, 0), recipe.steps.length - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function completeAndContinue() {
    setCompletedSteps((steps) => steps.includes(currentStep) ? steps : [...steps, currentStep]);
    if (currentStep < recipe.steps.length - 1) goToStep(currentStep + 1);
  }

  function restartCooking() {
    setCurrentStep(0);
    setCompletedSteps([]);
    setTimers({});
    setRestored(false);
    try { localStorage.removeItem(sessionKey); } catch { /* no-op */ }
  }

  return (
    <div className="min-h-dvh bg-[radial-gradient(circle_at_top_left,#fff0df_0,transparent_36%),#fff8ed] pb-32 lg:pb-10">
      <header className="sticky top-0 z-40 border-b border-border/70 bg-[#fffaf1]/92 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-[1240px] items-center justify-between gap-3 px-4 md:px-6 lg:h-[72px] lg:px-8">
          <Button asChild variant="ghost" className="h-11 rounded-full px-3 text-foreground">
            <Link href={`/recipes/${recipe.slug}`}><ArrowLeft className="size-5" />退出</Link>
          </Button>
          <div className="min-w-0 text-center">
            <p className="truncate text-sm font-black md:text-base">{recipe.title}</p>
            <p className="text-xs text-muted-foreground">{servings} 人份 · 第 {currentStep + 1} / {recipe.steps.length} 步</p>
          </div>
          <Button variant="ghost" className="h-11 rounded-full px-3" onClick={restartCooking} aria-label="重新开始烹饪">
            <RotateCcw className="size-4" /><span className="hidden sm:inline">重新开始</span>
          </Button>
        </div>
        <Progress value={progress} className="h-1.5 rounded-none bg-[#f1dfd2]" aria-label={`烹饪进度 ${Math.round(progress)}%`} />
      </header>

      <main className="mx-auto grid w-full max-w-[1240px] gap-5 px-4 py-5 md:px-6 md:py-8 lg:grid-cols-[230px_minmax(0,1fr)_270px] lg:gap-7 lg:px-8">
        <aside className="order-2 min-w-0 rounded-[24px] border bg-card p-4 card-shadow lg:order-1 lg:sticky lg:top-24 lg:h-fit">
          <div className="mb-3 flex items-center gap-2 font-black"><ListChecks className="size-5 text-primary" />全部步骤</div>
          <div className="hide-scrollbar flex gap-2 overflow-x-auto pb-1 lg:block lg:space-y-2 lg:overflow-visible">
            {recipe.steps.map((item, index) => {
              const complete = completedSteps.includes(index);
              return (
                <button key={`${item.title}-${index}`} type="button" onClick={() => goToStep(index)} aria-current={index === currentStep ? "step" : undefined}
                  className={cn("flex min-w-[156px] items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm transition lg:w-full", index === currentStep ? "bg-secondary font-black text-secondary-foreground" : "hover:bg-muted", complete && index !== currentStep && "text-[#52764d]")}>
                  <span className={cn("grid size-7 shrink-0 place-items-center rounded-full border bg-card text-xs font-black", complete && "border-[#79a271] bg-[#e9f3e4] text-[#456341]")}>{complete ? <Check className="size-4" /> : index + 1}</span>
                  <span className="line-clamp-2">{item.title}</span>
                </button>
              );
            })}
          </div>
        </aside>

        <section className="order-1 min-w-0 lg:order-2">
          {restored && (
            <div className="mb-4 flex items-start justify-between gap-3 rounded-2xl border border-[#bcd2b7] bg-[#eef7ea] px-4 py-3 text-sm text-[#456341]" role="status">
              <span><strong>已恢复上次进度。</strong> 你可以从第 {currentStep + 1} 步继续。</span>
              <button className="shrink-0 font-bold underline underline-offset-4" onClick={() => setRestored(false)}>知道了</button>
            </div>
          )}
          {wakeLockUnavailable && (
            <div className="mb-4 flex gap-3 rounded-2xl border border-[#efd6a0] bg-[#fff6d9] px-4 py-3 text-sm" role="status">
              <CircleAlert className="mt-0.5 size-5 shrink-0 text-[#9d6e16]" />
              <span>当前浏览器无法自动保持屏幕常亮，烹饪时请暂时关闭自动锁屏。</span>
            </div>
          )}

          {servings !== recipe.servings && <p className="mb-4 rounded-2xl border bg-[#fff6d9] p-4 text-sm leading-6">你选择了 {servings} 人份。食材清单和已标注的分步用量按 {(servings / recipe.servings).toFixed(2)} 倍换算，但下方文字中的克数、毫升仍是原配方 {recipe.servings} 人份。分次取料请按相同比例分配；火候与时间不能按人数等倍增加。</p>}
          <article className="overflow-hidden rounded-[28px] border bg-card soft-shadow md:rounded-[34px]">
            <div className="border-b bg-[linear-gradient(135deg,#fff0e2,#fffaf3_65%)] px-5 py-6 md:px-8 md:py-8">
              <div className="mb-4 flex items-center justify-between gap-3">
                <span className="rounded-full bg-primary px-3 py-1.5 text-xs font-black text-primary-foreground">第 {currentStep + 1} 步</span>
                {completedSteps.includes(currentStep) && <span className="flex items-center gap-1.5 text-sm font-bold text-[#52764d]"><Check className="size-4" />已完成</span>}
              </div>
              <h1 className="text-balance text-[30px] font-black leading-tight tracking-[-0.04em] md:text-[42px]">{step.title}</h1>
            </div>

            <div className="space-y-6 px-5 py-6 md:px-8 md:py-8">
              {stepIngredients.length > 0 && (
                <div>
                  <p className="mb-3 flex items-center gap-2 text-sm font-black text-muted-foreground"><Utensils className="size-4 text-primary" />本步涉及的食材（回锅不重复加料）</p>
                  <div className="flex flex-wrap gap-2">
                    {stepIngredients.map((ingredient) => <span key={ingredient.name} className="rounded-full border bg-[#fffaf3] px-3.5 py-2 text-sm font-bold">{ingredient.name}{ingredient.amount && <strong className="ml-1.5 text-primary">{ingredient.amount}</strong>}</span>)}
                  </div>
                </div>
              )}

              <p className="text-[20px] font-medium leading-[1.75] tracking-[-0.015em] md:text-[24px]">{step.text}</p>

              <div className="flex flex-wrap gap-2.5">
                {step.heat !== "不适用" && <span className="flex items-center gap-2 rounded-2xl bg-[#ffe4d6] px-4 py-3 font-black text-[#a43e22]"><Flame className="size-5" />{step.heat}</span>}
                {step.waterTemperature !== "不适用" && <span className="flex items-center gap-2 rounded-2xl bg-[#dff2f8] px-4 py-3 font-black text-[#356777]"><Droplets className="size-5" />{step.waterTemperature}</span>}
                {step.oilTemperature !== "不适用" && <span className="flex items-center gap-2 rounded-2xl bg-[#e9f3e4] px-4 py-3 font-black text-[#456341]"><ThermometerSun className="size-5" />{step.oilAmountMl ? `${Number((step.oilAmountMl * servings / recipe.servings).toFixed(1))}ml · ` : ""}{step.oilTemperature}</span>}
                {step.time && <span className="flex items-center gap-2 rounded-2xl bg-[#fff2c7] px-4 py-3 font-black text-[#82600f]"><Clock3 className="size-5" />{step.time}</span>}
              </div>

              {step.safety && <div className="rounded-[22px] border border-[#efc8bd] bg-[#fff2ee] p-4 text-sm font-semibold leading-6 text-[#8b3d32]">安全提醒：{step.safety}</div>}

              <div className="rounded-[22px] border border-[#bfd7ba] bg-[#eef7ea] p-4 md:p-5">
                <p className="mb-2 flex items-center gap-2 text-sm font-black text-[#52764d]"><Check className="size-5" />做到什么程度算完成？</p>
                <p className="text-[17px] font-semibold leading-7 text-[#324b30] md:text-[18px]">{step.cue}</p>
              </div>
            </div>
          </article>

          <div className="mt-5 flex items-center justify-between gap-3 lg:hidden">
            <Button variant="outline" className="h-12 flex-1 rounded-2xl text-base" disabled={currentStep === 0} onClick={() => goToStep(currentStep - 1)}><ChevronLeft />上一步</Button>
            <Button className="h-12 flex-[1.35] rounded-2xl text-base font-black shadow-[0_10px_24px_rgba(240,100,58,.2)]" onClick={completeAndContinue}>{currentStep === recipe.steps.length - 1 ? "完成烹饪" : "完成这一步"}<ChevronRight /></Button>
          </div>
        </section>

        <aside className="order-3 min-w-0 space-y-4 lg:sticky lg:top-24 lg:h-fit">
          {baseTimerSeconds > 0 && (
            <div className="rounded-[24px] border bg-card p-5 card-shadow">
              <p className="mb-4 flex items-center gap-2 font-black"><AlarmClock className="size-5 text-primary" />步骤计时器</p>
              <div className={cn("mb-4 rounded-[20px] bg-[#fff4d8] py-5 text-center font-mono text-[42px] font-black tabular-nums tracking-tight text-[#664b11]", timer.remainingSeconds === 0 && "bg-[#e9f3e4] text-[#456341]")} aria-live="polite">
                {timer.remainingSeconds === 0 ? "完成" : formatTime(timer.remainingSeconds)}
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button className="h-12 rounded-2xl font-black" onClick={toggleTimer}>{timer.running ? <Pause /> : <Play />}{timer.running ? "暂停" : timer.remainingSeconds === 0 ? "再计一次" : "开始"}</Button>
                <Button variant="outline" className="h-12 rounded-2xl" onClick={addThirtySeconds}>+30 秒</Button>
                <Button variant="ghost" className="col-span-2 h-10 rounded-xl text-muted-foreground" onClick={resetTimer}><TimerReset />重置计时</Button>
              </div>
            </div>
          )}

          <div className="hidden gap-2 lg:grid lg:grid-cols-2">
            <Button variant="outline" className="h-12 rounded-2xl" disabled={currentStep === 0} onClick={() => goToStep(currentStep - 1)}><ChevronLeft />上一步</Button>
            <Button className="h-12 rounded-2xl font-black" onClick={completeAndContinue}>{currentStep === recipe.steps.length - 1 ? "完成" : "下一步"}<ChevronRight /></Button>
          </div>
        </aside>
      </main>
    </div>
  );
}
