import { createContext } from 'svelte';
interface AppConfig {
	webUrl: string;
	classicUrl: string;
}

export const [getConfigContext, setConfigContext] = createContext<AppConfig>();