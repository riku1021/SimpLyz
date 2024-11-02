import Swal from 'sweetalert2';

// エラーアラート
export const showErrorAlert = (title, text) => {
	return Swal.fire({
		icon: 'error',
		title: title,
		text: text,
		timer: 3000,
		showConfirmButton: false,
		timerProgressBar: true,
		showCloseButton: true,
	});
};

// 情報アラート
export const showInfoAlert = (title, text) => {
	return Swal.fire({
		icon: 'info',
		title: title,
		html: text,
		input: 'password',
		inputAttributes: {
			autocapitalize: 'off',
		},
		showCancelButton: true,
		confirmButtonColor: '#1976d2',
		confirmButtonText: 'はい',
		cancelButtonText: 'キャンセル',
		showCloseButton: true,
	});
};

// 成功アラート
export const showSuccessAlert = (title, text) => {
	return Swal.fire({
		icon: 'success',
		title: title,
		text: text,
		timer: 2000,
		showConfirmButton: false,
		timerProgressBar: true,
		showCloseButton: true,
	});
};

// 確認アラート
export const showConfirmationAlert = (title, text, confirmButtonText, cancelButtonText) => {
	return Swal.fire({
		icon: 'warning',
		title: title,
		text: text,
		confirmButtonColor: '#1976d2',
		showCancelButton: true,
		confirmButtonText: confirmButtonText,
		cancelButtonText: cancelButtonText,
		showCloseButton: true,
	});
};