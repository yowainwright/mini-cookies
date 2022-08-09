import React from 'react'
import { MDXProvider } from '@mdx-js/react'
import Badges from './badges.mdx';

export function Header() {
	return (
		<header className="mc__container">
			<h1 className="mc__h1">Mini Cookies</h1>
			<p className="mc__desc mc__desc--center">
				A mini JS Document.cookie manager to help you write your cookies right! <span>🎯</span>
			</p>
			<div className="mc__desc mc__desc--center">
				<MDXProvider>
					<Badges />
				</MDXProvider>
			</div>
		</header>
	)
}
