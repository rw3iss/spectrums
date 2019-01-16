type ConsoleLogger = (...args) => void

interface Window {
    cl: ConsoleLogger
}

declare module NodeJS {
    interface Global {
      cl: ConsoleLogger
    }
}

//declare const cl: ConsoleLogger;