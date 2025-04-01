import React, { useEffect } from 'react';
import {
    Container,
    Box,
    Typography,
    Divider,
    Paper,
    Button // Optional: If you want a button to proceed further
} from '@mui/material';

const EvaluationSummary = (props) => {
    // Destructure props for cleaner access
    const {
        stance,
        strength,
        finalStance,
        finalStrength,
        question, 
        onComplete,   
        onCompleteButtonText = "Finish" 
    } = props;

    return (
        // Use a Container for consistent max-width and centering
        <Container maxWidth="sm" sx={{ my: 4 }}> {/* sm is suitable for summary views */}
            <Paper elevation={3} sx={{ padding: { xs: 2, sm: 4 } }}> {/* Use Paper for visual grouping */}
                <Typography variant="h4" component="h1" gutterBottom textAlign="center">
                    Evaluation Summary
                </Typography>

                {/* Optionally display the topic question */}
                {question && (
                    <>
                        <Typography variant="h6" fontWeight="bold" sx={{ mt: 3 }}>
                            Topic Evaluated:
                        </Typography>
                        <Typography paragraph sx={{ mb: 3, fontStyle: 'italic', color: 'text.secondary' }}>
                            {question}
                        </Typography>
                        <Divider />
                    </>
                )}

                <Typography variant="h5" component="h2" fontWeight="bold" sx={{ mt: 3, mb: 2 }}>
                    Stance Comparison
                </Typography>

                {/* Initial Assessment Section */}
                <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'medium', color: 'text.secondary' }}>Initial Assessment</Typography>
                    <Typography>
                        <strong>Stance:</strong> {stance || 'N/A'}
                    </Typography>
                    <Typography>
                        {/* Use nullish coalescing for strength if it might be 0 */}
                        <strong>Strength:</strong> {strength ?? 'N/A'} / 10
                    </Typography>
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Final Assessment Section */}
                <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'medium', color: 'text.secondary' }}>Final Assessment</Typography>
                    <Typography>
                        <strong>Stance:</strong> {finalStance || 'N/A'}
                    </Typography>
                    <Typography>
                        <strong>Strength:</strong> {finalStrength || 'N/A'} / 10
                    </Typography>
                </Box>

                {/* Optional Completion Button */}
                {onComplete && (
                    <Box sx={{ mt: 4, textAlign: 'center' }}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={onComplete}
                            size="large"
                        >
                            {onCompleteButtonText}
                        </Button>
                    </Box>
                )}

            </Paper>
        </Container>
    );
};

/* Optional: Add PropTypes for better component documentation and validation
import PropTypes from 'prop-types';

EvaluationSummary.propTypes = {
  initialStance: PropTypes.string, // Or PropTypes.oneOf(['YES', 'NO', ''])
  initialStrength: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  finalStance: PropTypes.string, // Or PropTypes.oneOf(['YES', 'NO', ''])
  finalStrength: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  questionText: PropTypes.string,
  onComplete: PropTypes.func,
  onCompleteButtonText: PropTypes.string,
};
*/

export default EvaluationSummary;