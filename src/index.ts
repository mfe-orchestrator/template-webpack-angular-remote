// The dynamic import keeps the entry point free of eagerly evaluated code, so
// Module Federation can negotiate the shared scope before the app boots.
import('./bootstrap');

export {};
