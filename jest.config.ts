import { pathsToModuleNameMapper, type JestConfigWithTsJest } from 'ts-jest'
import { compilerOptions } from './tsconfig.shared.json'

const jestConfig: JestConfigWithTsJest = {
	preset: 'ts-jest',
	testEnvironment: '@happy-dom/jest-environment',
	moduleDirectories: ['node_modules'],
	moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
		prefix: '<rootDir>/'
	})
}

export default jestConfig
