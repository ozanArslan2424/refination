export function SettingsPage() {
	console.count("🚀 Settings page rendered");

	function handleDeleteAccount() {
		console.log("TODO: Delete account");
	}

	return (
		<div className="px-16 py-8 lg:px-32">
			<h1>Settings</h1>

			<div className="p-4">
				<form>
					<fieldset>
						<label htmlFor="userName">User Name</label>
						<input type="text" id="userName" name="userName" />
					</fieldset>
					<fieldset>
						<label htmlFor="userEmail">User Email</label>
						<input type="email" id="userEmail" name="userEmail" />
					</fieldset>
					<fieldset>
						<label htmlFor="orgName">Organization Name</label>
						<input type="text" id="orgName" name="orgName" />
					</fieldset>

					<button type="submit" className="primary">
						Save
					</button>
				</form>
			</div>

			<div className="space-y-2 p-4">
				<h2 className="text-rose-500">Danger</h2>
				<p className="font-semibold text-lg">If you click the red button below, I will, </p>
				<ol className="list-inside list-decimal py-2">
					<li>Completely delete your account.</li>
					<li>Remove you from my database.</li>
					<li>Never let you vote again.</li>
					<li>Never see you again.</li>
				</ol>
				<p className="text-sm">&#40;Unless you make a new account, of course.&#41;</p>
				<button type="button" className="error mt-4" onClick={handleDeleteAccount}>
					Delete my account
				</button>
			</div>
		</div>
	);
}
